import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { Product } from '../models/product.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { buildWelcomeEmail } from '../utils/emailTemplates.js'
import {
  isDeliverableEmail,
  notifyInBackground,
  sendMailSafe,
} from '../utils/mailService.js'
import { serializeUser } from '../utils/serializers.js'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
}

const populateUserRelations = (userId) =>
  User.findById(userId)
    .populate('wishlist', 'slug')
    .populate('cart.product')

const issueTokens = async (user) => {
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()
  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })
  return { accessToken, refreshToken }
}

export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body

  if (!fullName?.trim() || !email?.trim() || !password) {
    throw new ApiError(400, 'Full name, email, and password are required')
  }

  const normalizedEmail = email.trim().toLowerCase()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists')
  }

  const created = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    role: 'customer',
  })

  const { accessToken, refreshToken } = await issueTokens(created)
  const populated = await populateUserRelations(created._id)

  notifyInBackground(
    () =>
      sendMailSafe({
        to: created.email,
        ...buildWelcomeEmail({ fullName: created.fullName }),
        context: 'customer-signup',
      }),
    'customer-signup',
  )

  return res
    .status(201)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: serializeUser(populated), accessToken },
        'Account created successfully',
      ),
    )
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email?.trim() || !password) {
    throw new ApiError(400, 'Email and password are required')
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select('+password')

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const { accessToken, refreshToken } = await issueTokens(user)
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: serializeUser(populated), accessToken },
        'Signed in successfully',
      ),
    )
})

export const logout = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 },
    })
  }

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Signed out successfully'))
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken
  if (!incomingToken) {
    throw new ApiError(401, 'Refresh token missing')
  }

  const secret =
    process.env.REFRESH_TOKEN_SECRET || 'velora-dev-refresh-secret-change-in-env'
  const decoded = jwt.verify(incomingToken, secret)
  const user = await User.findById(decoded._id).select('+refreshToken')

  if (!user || user.refreshToken !== incomingToken) {
    throw new ApiError(401, 'Invalid refresh token')
  }

  const { accessToken, refreshToken } = await issueTokens(user)

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken },
        'Access token refreshed successfully',
      ),
    )
})

export const syncCustomerSession = asyncHandler(async (req, res) => {
  const { fullName, email, avatarUrl } = req.body || {}
  const user = await populateUserRelations(req.user._id)

  let modified = false
  let promotedFromPlaceholder = false
  if (fullName?.trim() && (!user.fullName || user.fullName === 'Velora Client')) {
    user.fullName = fullName.trim()
    modified = true
  }
  if (
    email?.trim() &&
    user.email.endsWith('@clerk.velora.local')
  ) {
    const nextEmail = email.trim().toLowerCase()
    user.email = nextEmail
    modified = true
    promotedFromPlaceholder = isDeliverableEmail(nextEmail)
  }
  if (avatarUrl && !user.avatarUrl) {
    user.avatarUrl = avatarUrl
    modified = true
  }
  if (modified) {
    await user.save({ validateBeforeSave: false })
  }
  if (promotedFromPlaceholder) {
    notifyInBackground(
      () =>
        sendMailSafe({
          to: user.email,
          ...buildWelcomeEmail({ fullName: user.fullName }),
          context: 'customer-sync-welcome',
        }),
      'customer-sync-welcome',
    )
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeUser(user),
        'Customer session synchronized',
      ),
    )
})

export const getProfile = asyncHandler(async (req, res) => {
  const populated = await populateUserRelations(req.user._id)
  return res
    .status(200)
    .json(new ApiResponse(200, serializeUser(populated), 'Profile fetched'))
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, phone, preferredSize, newsletterOptIn } = req.body
  const user = await User.findById(req.user._id)

  if (fullName !== undefined) user.fullName = String(fullName).trim()
  if (email !== undefined) user.email = String(email).trim().toLowerCase()
  if (phone !== undefined) user.phone = String(phone).trim()
  if (preferredSize !== undefined) user.preferredSize = preferredSize
  if (newsletterOptIn !== undefined) {
    user.newsletterOptIn = Boolean(newsletterOptIn)
  }

  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(200, serializeUser(populated), 'Profile updated'),
    )
})

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const {
    label,
    recipient,
    street,
    city,
    region,
    postalCode,
    country,
    phone,
    isDefault,
  } = req.body

  if (!label || !recipient || !street || !city || !region || !postalCode) {
    throw new ApiError(400, 'Complete shipping address details are required')
  }

  const makeDefault = Boolean(isDefault) || user.addresses.length === 0
  if (makeDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false
    })
  }

  user.addresses.unshift({
    label,
    recipient,
    street,
    city,
    region,
    postalCode,
    country: country || 'United States',
    phone: phone || '',
    isDefault: makeDefault,
  })

  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        serializeUser(populated).addresses,
        'Address saved',
      ),
    )
})

export const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params
  const user = await User.findById(req.user._id)
  const target = user.addresses.id(addressId)

  if (!target) {
    throw new ApiError(404, 'Address not found')
  }

  const fields = [
    'label',
    'recipient',
    'street',
    'city',
    'region',
    'postalCode',
    'country',
    'phone',
  ]
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      target[field] = req.body[field]
    }
  }

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === addressId
    })
  }

  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeUser(populated).addresses,
        'Address updated',
      ),
    )
})

export const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params
  const user = await User.findById(req.user._id)
  const target = user.addresses.id(addressId)

  if (!target) {
    throw new ApiError(404, 'Address not found')
  }

  target.deleteOne()
  if (
    user.addresses.length > 0 &&
    !user.addresses.some((addr) => addr.isDefault)
  ) {
    user.addresses[0].isDefault = true
  }

  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeUser(populated).addresses,
        'Address removed',
      ),
    )
})

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params
  const user = await User.findById(req.user._id)
  const target = user.addresses.id(addressId)

  if (!target) {
    throw new ApiError(404, 'Address not found')
  }

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === addressId
  })

  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeUser(populated).addresses,
        'Default address updated',
      ),
    )
})

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body
  if (!productId) {
    throw new ApiError(400, 'Product identifier is required')
  }

  const product = await Product.findOne({ slug: productId })
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const user = await User.findById(req.user._id)
  const index = user.wishlist.findIndex(
    (id) => id.toString() === product._id.toString(),
  )

  if (index >= 0) {
    user.wishlist.splice(index, 1)
  } else {
    user.wishlist.push(product._id)
  }

  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeUser(populated).wishlistIds,
        'Wishlist updated',
      ),
    )
})

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, size = 'One Size', color = 'Default', quantity = 1 } =
    req.body

  const requestedQty = Math.floor(Number(quantity))
  if (!productId || !Number.isFinite(requestedQty) || requestedQty < 1) {
    throw new ApiError(400, 'Valid product and quantity are required')
  }

  const product = await Product.findOne({ slug: productId })
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const availableStock = product.stock ?? 0
  if (availableStock <= 0) {
    throw new ApiError(400, `${product.name} is currently out of stock`)
  }

  const user = await User.findById(req.user._id)
  const existing = user.cart.find(
    (item) =>
      item.product.toString() === product._id.toString() &&
      item.size === size &&
      item.color === color,
  )

  const totalDesiredQty = (existing?.quantity || 0) + requestedQty
  if (totalDesiredQty > availableStock) {
    throw new ApiError(
      400,
      `Only ${availableStock} unit(s) available for ${product.name}`,
    )
  }

  if (existing) {
    existing.quantity = totalDesiredQty
  } else {
    user.cart.push({
      product: product._id,
      size,
      color,
      quantity: requestedQty,
    })
  }

  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeUser(populated).cartItems,
        'Item added to bag',
      ),
    )
})

export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params
  const { quantity } = req.body
  const user = await User.findById(req.user._id)
  const item = user.cart.id(itemId)

  if (!item) {
    throw new ApiError(404, 'Bag item not found')
  }

  if (Number(quantity) <= 0) {
    item.deleteOne()
  } else {
    const nextQty = Math.floor(Number(quantity))
    if (!Number.isFinite(nextQty)) {
      throw new ApiError(400, 'Invalid quantity')
    }
    const product = await Product.findById(item.product)
    const availableStock = product?.stock ?? 0
    if (product && nextQty > availableStock) {
      throw new ApiError(
        400,
        `Only ${availableStock} unit(s) available for ${product.name}`,
      )
    }
    item.quantity = nextQty
  }

  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeUser(populated).cartItems,
        'Bag updated',
      ),
    )
})

export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params
  const user = await User.findById(req.user._id)
  const item = user.cart.id(itemId)

  if (!item) {
    throw new ApiError(404, 'Bag item not found')
  }

  item.deleteOne()
  await user.save()
  const populated = await populateUserRelations(user._id)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeUser(populated).cartItems,
        'Item removed from bag',
      ),
    )
})

export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  user.cart = []
  await user.save()

  return res
    .status(200)
    .json(new ApiResponse(200, [], 'Shopping bag cleared'))
})
