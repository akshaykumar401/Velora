import mongoose, { Schema } from 'mongoose'

const colorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const productSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    categoryRef: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    fabric: {
      type: String,
      trim: true,
      default: '',
    },
    care: {
      type: String,
      trim: true,
      default: '',
    },
    sizes: {
      type: [String],
      default: ['One Size'],
    },
    colors: {
      type: [colorSchema],
      default: [],
    },
    image: {
      type: String,
      default: null,
    },
    placeholderTone: {
      type: String,
      default: 'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]',
    },
    featuredOrder: {
      type: Number,
      default: 99,
    },
    stock: {
      type: Number,
      default: 25,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
})

productSchema.index({ name: 'text', category: 'text', description: 'text' })

export const Product = mongoose.model('Product', productSchema)

export const findProductByIdOrSlug = async (idOrSlug) => {
  if (!idOrSlug) return null
  const filters = [{ slug: String(idOrSlug).trim().toLowerCase() }]
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    filters.push({ _id: idOrSlug })
  }
  return Product.findOne({ $or: filters })
}

