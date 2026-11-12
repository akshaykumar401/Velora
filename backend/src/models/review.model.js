import mongoose, { Schema } from 'mongoose'

const reviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Published', 'Pending', 'Hidden'],
      default: 'Pending',
      index: true,
    },
  },
  { timestamps: true },
)

reviewSchema.index({ product: 1, status: 1, createdAt: -1 })

export const Review = mongoose.model('Review', reviewSchema)

