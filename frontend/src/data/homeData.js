import { CATEGORIES, PRODUCTS } from './catalogData.js'

export const HERO_DATA = {
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU8BC1RARh9YTFj_i6rr6yIXdwCQ1cSnrjlvMQ0DjVbfGfJe3mVOLoTQai&s=10",
  eyebrow: 'DISCOVER THE AUTUMN / WINTER COLLECTION',
  title: 'Timeless Elegance, Modern Craft',
  subtitle:
    'Immaculate tailoring, noble materials, and effortless silhouettes designed for the discerning wardrobe.',
}

export const CURATED_CATEGORIES = CATEGORIES.filter((cat) => cat.featured)

export const TRENDING_PRODUCTS = PRODUCTS.slice(0, 6)

export const PHILOSOPHY_DATA = {
  image: null,
}
