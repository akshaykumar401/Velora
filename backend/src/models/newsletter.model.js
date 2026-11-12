import mongoose, { Schema } from 'mongoose'

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ['footer', 'velora-circle'],
      default: 'footer',
    },
  },
  { timestamps: true },
)

export const Newsletter = mongoose.model('Newsletter', newsletterSchema)

