import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const addressSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    recipient: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'United States' },
    phone: { type: String, trim: true, default: '' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
)

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    size: { type: String, default: 'One Size' },
    color: { type: String, default: 'Default' },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true },
)

const userSchema = new Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'Atelier Director',
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    studio: {
      type: String,
      trim: true,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    preferredSize: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL'],
      default: 'M',
    },
    newsletterOptIn: {
      type: Boolean,
      default: true,
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    cart: [cartItemSchema],
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
)

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.generateAccessToken = function () {
  const secret =
    process.env.ACCESS_TOKEN_SECRET || 'velora-dev-access-secret-change-in-env'
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    secret,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' },
  )
}

userSchema.methods.generateRefreshToken = function () {
  const secret =
    process.env.REFRESH_TOKEN_SECRET || 'velora-dev-refresh-secret-change-in-env'
  return jwt.sign(
    {
      _id: this._id,
    },
    secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' },
  )
}

export const User = mongoose.model('User', userSchema)

