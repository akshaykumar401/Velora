import { Category } from '../models/category.model.js'

export const toSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const escapeRegex = (value) =>
  String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const findCategoryByIdentifier = async (idOrSlug) => {
  if (!idOrSlug) return null
  const raw = String(idOrSlug).trim()
  const normalizedSlug = raw.toLowerCase()
  const filters = [{ slug: normalizedSlug }]
  if (/^[0-9a-fA-F]{24}$/.test(raw)) {
    filters.push({ _id: raw })
  }
  return Category.findOne({ $or: filters })
}

export const resolveMatchingCategory = async ({ department, category }) => {
  const deptSlug = toSlug(department)
  const catSlug = toSlug(category)
  const catTitle = String(category || '').trim()

  const orConditions = []
  if (deptSlug) orConditions.push({ slug: deptSlug })
  if (catSlug && catSlug !== deptSlug) orConditions.push({ slug: catSlug })
  if (catTitle) {
    orConditions.push({ title: new RegExp(`^${escapeRegex(catTitle)}$`, 'i') })
  }

  if (orConditions.length === 0) return null
  return Category.findOne({ $or: orConditions })
}

export const buildCategoryProductFilter = (categoryDoc, fallbackSlug) => {
  const normalizedSlug = toSlug(categoryDoc?.slug || fallbackSlug)
  const filters = []

  if (normalizedSlug) {
    filters.push({ department: normalizedSlug }, { tags: normalizedSlug })
  }
  if (categoryDoc?._id) {
    filters.push({ categoryRef: categoryDoc._id })
  }
  if (categoryDoc?.title) {
    filters.push({
      category: new RegExp(`^${escapeRegex(categoryDoc.title.trim())}$`, 'i'),
    })
  }
  if (fallbackSlug && toSlug(fallbackSlug) !== normalizedSlug) {
    filters.push({ department: String(fallbackSlug).trim().toLowerCase() })
  }

  return filters.length > 0 ? { $or: filters } : {}
}

export const doesProductMatchCategory = (product, category) => {
  if (!product || !category) return false
  const catId = category._id?.toString()
  const catSlug = toSlug(category.slug)
  const catTitleLower = String(category.title || '').trim().toLowerCase()

  if (catId && product.categoryRef?.toString() === catId) return true
  if (catSlug && product.department?.toLowerCase() === catSlug) return true
  if (
    catSlug &&
    Array.isArray(product.tags) &&
    product.tags.some((t) => String(t).toLowerCase() === catSlug)
  ) {
    return true
  }
  if (catSlug && toSlug(product.category) === catSlug) return true
  if (
    catTitleLower &&
    String(product.category || '').trim().toLowerCase() === catTitleLower
  ) {
    return true
  }
  return false
}

export const countProductsForCategories = (categories = [], products = []) => {
  const counts = new Map()
  for (const cat of categories) {
    let total = 0
    for (const prod of products) {
      if (doesProductMatchCategory(prod, cat)) {
        total += 1
      }
    }
    counts.set(cat.slug, total)
  }
  return counts
}

