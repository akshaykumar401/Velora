import mongoose, { Schema } from 'mongoose'

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    productSlug: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, default: 'One Size' },
    color: { type: String, default: 'Default' },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['In Preparation', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'In Preparation',
      index: true,
    },
    deliveryMethod: {
      type: String,
      default: 'Standard Atelier Courier',
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed', 'Refunded'],
      default: 'Paid',
    },
    paymentLast4: {
      type: String,
      default: '',
    },
    paymentDetails: {
      gateway: { type: String, default: 'razorpay' },
      razorpayOrderId: { type: String, default: '', index: true },
      razorpayPaymentId: { type: String, default: '', index: true },
      method: { type: String, default: '' },
      last4: { type: String, default: '' },
      network: { type: String, default: '' },
      vpa: { type: String, default: '' },
      bank: { type: String, default: '' },
      wallet: { type: String, default: '' },
    },
    shippingAddress: {
      recipient: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
)

export const Order = mongoose.model('Order', orderSchema)

