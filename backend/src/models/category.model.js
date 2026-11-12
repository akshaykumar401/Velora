import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    indexLabel: {
      type: String,
      trim: true,
      default: '01 / COLLECTION',
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    placeholderBg: {
      type: String,
      default: 'bg-gradient-to-br from-[#D9CFC2] via-[#AFA190] to-[#5E5247]',
    },
  },
  { timestamps: true },
)

export const Category = mongoose.model('Category', categorySchema)

