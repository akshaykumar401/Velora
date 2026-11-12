import { Order } from '../models/order.model.js'
import { Product } from '../models/product.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  buildAdminNewOrderEmail,
  buildOrderConfirmationEmail,
} from '../utils/emailTemplates.js'
import {
  getConciergeNotificationEmails,
  notifyInBackground,
  sendMailSafe,
  sendMailToMany,
} from '../utils/mailService.js'
import {
  describeRazorpayPayment,
  getRazorpayClient,
  getRazorpayCredentials,
  isRazorpayConfigured,
  toRazorpayApiError,
  verifyRazorpaySignature,
} from '../utils/razorpay.js'
import { serializeOrder } from '../utils/serializers.js'

const validateShippingAddress = (shippingAddress) => {
  if (
    !shippingAddress?.recipient?.trim() ||
    !shippingAddress?.street?.trim() ||
    !shippingAddress?.city?.trim() ||
    !shippingAddress?.region?.trim() ||
    !shippingAddress?.postalCode?.trim() ||
    !shippingAddress?.country?.trim()
  ) {
    throw new ApiError(400, 'Complete shipping address is required')
  }
}

const resolveCheckoutItemsAndPricing = async ({
  userId,
  deliveryMethod,
  bodyItems,
}) => {
  const user = await User.findById(userId).populate('cart.product')
  if (!user) {
    throw new ApiError(404, 'Customer account not found')
  }

  let sourceItems = []
  if (user.cart?.length > 0) {
    sourceItems = user.cart
      .filter((entry) => entry.product)
      .map((entry) => ({
        product: entry.product,
        size: entry.size || 'One Size',
        color: entry.color || 'Default',
        quantity: entry.quantity,
      }))
  } else if (Array.isArray(bodyItems) && bodyItems.length > 0) {
    const slugs = bodyItems.map((i) => i.productId)
    const dbProducts = await Product.find({ slug: { $in: slugs } })
    const bySlug = new Map(dbProducts.map((p) => [p.slug, p]))

    sourceItems = bodyItems
      .map((entry) => ({
        product: bySlug.get(entry.productId),
        size: entry.size || 'One Size',
        color: entry.color || 'Default',
        quantity: Number(entry.quantity) || 1,
      }))
      .filter((entry) => entry.product)
  }

  if (sourceItems.length === 0) {
    throw new ApiError(400, 'Shopping bag is empty')
  }

  const orderItems = sourceItems.map(({ product, size, color, quantity }) => {
    const safeQty = Math.max(1, Math.floor(Number(quantity) || 1))
    if ((product.stock ?? 0) < safeQty) {
      throw new ApiError(400, `Insufficient stock available for ${product.name}`)
    }
    return {
      product: product._id,
      productSlug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      size,
      color,
      quantity: safeQty,
    }
  })

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const shippingFee =
    deliveryMethod === 'Express Priority Air' && subtotal < 4000 ? 250 : 0
  const total = subtotal + shippingFee

  if (total <= 0) {
    throw new ApiError(400, 'Order total must be greater than zero')
  }

  return {
    user,
    orderItems,
    subtotal,
    shippingFee,
    total,
    amountInPaise: Math.round(total * 100),
  }
}

const restoreInventory = async (items) => {
  for (const prev of items) {
    await Product.findByIdAndUpdate(prev.product, {
      $inc: { stock: prev.quantity },
    })
  }
}

const decrementInventory = async (orderItems) => {
  const decrementedItems = []
  for (const item of orderItems) {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
    )
    if (!updatedProduct) {
      await restoreInventory(decrementedItems)
      throw new ApiError(
        400,
        `Insufficient stock available for ${item.name}`,
      )
    }
    decrementedItems.push(item)
  }
  return decrementedItems
}

const generateOrderNumber = () => {
  const now = new Date()
  return `VLR-${now.getFullYear().toString().slice(-2)}${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
}

export const getPaymentConfig = asyncHandler(async (_req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        gateway: 'razorpay',
        configured: isRazorpayConfigured(),
        currency: 'INR',
      },
      'Payment gateway configuration fetched',
    ),
  )
})

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    deliveryMethod = 'Standard Atelier Courier',
    items: bodyItems,
  } = req.body

  validateShippingAddress(shippingAddress)

  const { user, subtotal, shippingFee, total, amountInPaise } =
    await resolveCheckoutItemsAndPricing({
      userId: req.user._id,
      deliveryMethod,
      bodyItems,
    })

  if (amountInPaise < 100) {
    throw new ApiError(
      400,
      'Minimum order total for Razorpay checkout is INR 1',
    )
  }

  const razorpay = getRazorpayClient()
  const { keyId } = getRazorpayCredentials()
  const receipt = `vlr_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`

  let rzpOrder
  try {
    rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        userId: user._id.toString(),
        customerEmail: user.email,
        deliveryMethod,
      },
    })
  } catch (err) {
    throw toRazorpayApiError(
      err,
      'Unable to initialize Razorpay payment order',
    )
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        keyId,
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        receipt: rzpOrder.receipt,
        subtotal,
        shippingFee,
        total,
      },
      'Razorpay order initialized',
    ),
  )
})

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    shippingAddress,
    deliveryMethod = 'Standard Atelier Courier',
    items: bodyItems,
  } = req.body

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, 'Razorpay payment verification details are required')
  }

  const existingOrder = await Order.findOne({
    'paymentDetails.razorpayPaymentId': razorpayPaymentId,
  })
  if (existingOrder) {
    if (String(existingOrder.user) !== String(req.user._id)) {
      throw new ApiError(403, 'Payment record belongs to another account')
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          serializeOrder(existingOrder),
          'Order already verified',
        ),
      )
  }

  const isSignatureValid = verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  })
  if (!isSignatureValid) {
    throw new ApiError(400, 'Invalid Razorpay payment signature')
  }

  validateShippingAddress(shippingAddress)

  const { user, orderItems, subtotal, shippingFee, total, amountInPaise } =
    await resolveCheckoutItemsAndPricing({
      userId: req.user._id,
      deliveryMethod,
      bodyItems,
    })

  const razorpay = getRazorpayClient()
  let rzpPayment
  let rzpOrder
  try {
    ;[rzpPayment, rzpOrder] = await Promise.all([
      razorpay.payments.fetch(razorpayPaymentId),
      razorpay.orders.fetch(razorpayOrderId),
    ])
  } catch (err) {
    throw toRazorpayApiError(err, 'Unable to verify payment with Razorpay')
  }

  if (rzpPayment.order_id !== razorpayOrderId) {
    throw new ApiError(400, 'Payment does not match the initialized order')
  }
  if (String(rzpPayment.currency || '').toUpperCase() !== 'INR') {
    throw new ApiError(400, 'Unsupported payment currency')
  }

  if (rzpPayment.status === 'authorized') {
    try {
      rzpPayment = await razorpay.payments.capture(
        razorpayPaymentId,
        rzpPayment.amount,
        'INR',
      )
    } catch {
      rzpPayment = await razorpay.payments.fetch(razorpayPaymentId)
    }
  }

  if (!['captured', 'authorized'].includes(rzpPayment.status)) {
    throw new ApiError(
      400,
      `Payment is ${rzpPayment.status || 'incomplete'} and cannot be confirmed`,
    )
  }

  if (
    Number(rzpPayment.amount) !== amountInPaise ||
    Number(rzpOrder.amount) !== amountInPaise
  ) {
    throw new ApiError(
      400,
      'Paid amount does not match the current order total',
    )
  }

  const paymentMeta = describeRazorpayPayment(rzpPayment)
  const decrementedItems = await decrementInventory(orderItems)

  let order
  try {
    order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: user._id,
      customerName: shippingAddress.recipient || user.fullName,
      customerEmail: user.email,
      status: 'In Preparation',
      deliveryMethod,
      paymentMethod: paymentMeta.paymentMethod,
      paymentStatus: 'Paid',
      paymentLast4: paymentMeta.paymentLast4,
      paymentDetails: paymentMeta.paymentDetails,
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      total,
    })
  } catch (err) {
    await restoreInventory(decrementedItems)
    throw err
  }

  user.cart = []
  await user.save()

  const orderData = serializeOrder(order)
  notifyInBackground(async () => {
    await sendMailSafe({
      to: order.customerEmail,
      ...buildOrderConfirmationEmail({ order: orderData }),
      context: `order-confirmation:${order.orderNumber}`,
    })

    const adminRecipients = getConciergeNotificationEmails()
    if (adminRecipients.length > 0) {
      await sendMailToMany({
        recipients: adminRecipients,
        ...buildAdminNewOrderEmail({ order: orderData }),
        context: `admin-order-alert:${order.orderNumber}`,
      })
    }
  }, `order:${order.orderNumber}`)

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        orderData,
        'Payment verified and order placed successfully',
      ),
    )
})

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  })

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        orders.map(serializeOrder),
        'Orders fetched successfully',
      ),
    )
})

export const getMyOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  const order = await Order.findOne({
    orderNumber: orderId,
    user: req.user._id,
  })

  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, serializeOrder(order), 'Order fetched successfully'),
    )
})
