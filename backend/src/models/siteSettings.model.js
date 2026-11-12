import mongoose, { Schema } from 'mongoose'

export const DEFAULT_STOREFRONT_SETTINGS = {
  heroImage: null,
  heroEyebrow: 'DISCOVER THE AUTUMN / WINTER COLLECTION',
  heroTitle: 'Timeless Elegance, Modern Craft',
  heroSubtitle:
    'Immaculate tailoring, noble materials, and effortless silhouettes designed for the discerning wardrobe.',
  philosophyImage: null,
}

const siteSettingsSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'storefront',
      index: true,
    },
    heroImage: {
      type: String,
      default: null,
    },
    heroEyebrow: {
      type: String,
      trim: true,
      default: DEFAULT_STOREFRONT_SETTINGS.heroEyebrow,
    },
    heroTitle: {
      type: String,
      trim: true,
      default: DEFAULT_STOREFRONT_SETTINGS.heroTitle,
    },
    heroSubtitle: {
      type: String,
      trim: true,
      default: DEFAULT_STOREFRONT_SETTINGS.heroSubtitle,
    },
    philosophyImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema)

