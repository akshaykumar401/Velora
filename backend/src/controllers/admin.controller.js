import { User } from '../models/user.model.js'
import { Product } from '../models/product.model.js'
import { Category } from '../models/category.model.js'
import { Order } from '../models/order.model.js'
import { Review } from '../models/review.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { parseConfiguredAdminAccounts } from '../utils/adminConfig.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  buildOrderConfirmationEmail,
  buildOrderStatusEmail,
} from '../utils/emailTemplates.js'
import {
  isDeliverableEmail,
  notifyInBackground,
  sendMail,
  sendMailSafe,
} from '../utils/mailService.js'
import { serializeOrder, serializeReview } from '../utils/serializers.js'

const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
}

const serializeAdmin = (admin) => ({
  _id: admin._id.toString(),
  name: admin.fullName,
  role: admin.title || 'Atelier Director',
  email: admin.contactEmail || admin.email,
  authEmail: admin.email,
  studio: admin.studio || 'Mercer Street Studio, New York',
  phone: admin.phone || '',
})

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password, passcode } = req.body
  const submittedPassword = password ?? passcode

  if (!email?.trim() || !submittedPassword) {
    throw new ApiError(400, 'Administrator email and password are required')
  }

  const configuredAccounts = parseConfiguredAdminAccounts()
  if (configuredAccounts.length === 0) {
    throw new ApiError(
      500,
      'Admin credentials (ADMIN_EMAIL and ADMIN_PASSWORD) are not configured in backend .env',
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  const matchedAccount = configuredAccounts.find(
    (account) => account.email === normalizedEmail,
  )

  if (!matchedAccount || submittedPassword !== matchedAccount.password) {
    throw new ApiError(401, 'Invalid administrator email or password')
  }

  let admin = await User.findOne({ email: matchedAccount.email }).select(
    '+password',
  )

  if (!admin) {
    admin = await User.create({
      fullName: process.env.ADMIN_NAME?.trim() || 'Velora Administrator',
      email: matchedAccount.email,
      password: matchedAccount.password,
      role: 'admin',
      title: process.env.ADMIN_TITLE?.trim() || 'Atelier Director',
      studio: process.env.ADMIN_STUDIO?.trim() || 'Mercer Street Studio, New York',
      phone: process.env.ADMIN_PHONE?.trim() || '',
    })
  } else {
    if (admin.role !== 'admin') {
      admin.role = 'admin'
    }
    if (!(await admin.isPasswordCorrect(matchedAccount.password))) {
      admin.password = matchedAccount.password
    }
  }

  const accessToken = admin.generateAccessToken()
  const refreshToken = admin.generateRefreshToken()
  admin.refreshToken = refreshToken
  await admin.save({ validateBeforeSave: false })

  return res
    .status(200)
    .cookie('adminAccessToken', accessToken, adminCookieOptions)
    .cookie('adminRefreshToken', refreshToken, adminCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          admin: serializeAdmin(admin),
          accessToken,
        },
        'Administrator signed in successfully',
      ),
    )
})

export const adminLogout = asyncHandler(async (req, res) => {
  if (req.admin?._id) {
    await User.findByIdAndUpdate(req.admin._id, {
      $unset: { refreshToken: 1 },
    })
  }

  return res
    .status(200)
    .clearCookie('adminAccessToken', adminCookieOptions)
    .clearCookie('adminRefreshToken', adminCookieOptions)
    .json(new ApiResponse(200, {}, 'Administrator signed out'))
})

export const getAdminMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, serializeAdmin(req.admin), 'Admin profile fetched'))
})

export const updateAdminMe = asyncHandler(async (req, res) => {
  const { name, role, email, studio, phone } = req.body
  const admin = await User.findById(req.admin._id)

  if (!admin) {
    throw new ApiError(404, 'Administrator account not found')
  }

  if (name !== undefined) {
    const trimmedName = String(name).trim()
    if (!trimmedName) {
      throw new ApiError(400, 'Administrator name is required')
    }
    admin.fullName = trimmedName
  }
  if (role !== undefined) admin.title = String(role).trim()
  if (email !== undefined) {
    admin.contactEmail = String(email).trim().toLowerCase()
  }
  if (studio !== undefined) admin.studio = String(studio).trim()
  if (phone !== undefined) admin.phone = String(phone).trim()

  await admin.save()

  return res
    .status(200)
    .json(
      new ApiResponse(200, serializeAdmin(admin), 'Admin profile updated'),
    )
})

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [
    productsCount,
    categoriesCount,
    orderAgg,
    pendingReviewsCount,
    totalReviewsCount,
    recentOrders,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrdersCount: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $ne: ['$status', 'Cancelled'] }, '$total', 0],
            },
          },
          activeOrdersCount: {
            $sum: {
              $cond: [
                { $in: ['$status', ['In Preparation', 'Shipped']] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
    Review.countDocuments({ status: 'Pending' }),
    Review.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  const orderStats = orderAgg[0] || {
    totalRevenue: 0,
    activeOrdersCount: 0,
    totalOrdersCount: 0,
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats: {
          totalRevenue: orderStats.totalRevenue,
          activeOrdersCount: orderStats.activeOrdersCount,
          productsCount,
          categoriesCount,
          pendingReviewsCount,
          totalOrdersCount: orderStats.totalOrdersCount,
          totalReviewsCount,
        },
        recentOrders: recentOrders.map(serializeOrder),
      },
      'Dashboard statistics fetched',
    ),
  )
})

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean()
  return res
    .status(200)
    .json(
      new ApiResponse(200, orders.map(serializeOrder), 'All orders fetched'),
    )
})

export const getAdminOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  const order = await Order.findOne({ orderNumber: orderId }).lean()
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, serializeOrder(order), 'Order fetched'))
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  const { status } = req.body

  const valid = ['In Preparation', 'Shipped', 'Delivered', 'Cancelled']
  if (!valid.includes(status)) {
    throw new ApiError(400, 'Invalid order status')
  }

  const order = await Order.findOne({ orderNumber: orderId })
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  const previousStatus = order.status
  if (previousStatus !== status) {
    order.status = status
    await order.save()
  }

  const serialized = serializeOrder(order)
  if (previousStatus !== status) {
    notifyInBackground(
      () =>
        sendMailSafe({
          to: order.customerEmail,
          ...buildOrderStatusEmail({ order: serialized, previousStatus }),
          context: `order-status:${order.orderNumber}`,
        }),
      `order-status:${order.orderNumber}`,
    )
  }

  return res
    .status(200)
    .json(new ApiResponse(200, serialized, 'Order status updated'))
})

export const resendOrderReceipt = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  const order = await Order.findOne({ orderNumber: orderId }).lean()
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  if (!isDeliverableEmail(order.customerEmail)) {
    throw new ApiError(
      400,
      'Order does not have a valid deliverable customer email',
    )
  }

  const serialized = serializeOrder(order)
  await sendMail({
    to: order.customerEmail,
    ...buildOrderConfirmationEmail({ order: serialized }),
  })

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { sentTo: order.customerEmail },
        `Order receipt sent to ${order.customerEmail}`,
      ),
    )
})

export const getAllReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find()
    .populate('product', 'name slug image')
    .populate('user', 'fullName email')
    .sort({ createdAt: -1 })
    .lean()
  return res
    .status(200)
    .json(
      new ApiResponse(200, reviews.map(serializeReview), 'All reviews fetched'),
    )
})

export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { reviewId } = req.params
  const { status } = req.body

  if (!['Published', 'Pending', 'Hidden'].includes(status)) {
    throw new ApiError(400, 'Invalid review status')
  }

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { status },
    { returnDocument: 'after' },
  )
    .populate('product', 'name slug image')
    .populate('user', 'fullName email')

  if (!review) {
    throw new ApiError(404, 'Review not found')
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, serializeReview(review), 'Review status updated'),
    )
})

export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params
  const deleted = await Review.findByIdAndDelete(reviewId)
  if (!deleted) {
    throw new ApiError(404, 'Review not found')
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { id: reviewId }, 'Review deleted successfully'),
    )
})

