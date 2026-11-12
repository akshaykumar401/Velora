export const ORDER_STATUS_OPTIONS = [
  'In Preparation',
  'Shipped',
  'Delivered',
  'Cancelled',
]

export const formatOrderPaymentLabel = (order) => {
  if (!order) return 'Razorpay'
  const method =
    order.paymentMethod || (order.paymentLast4 ? 'Card' : 'Razorpay')
  const last4 = order.paymentLast4 || order.paymentDetails?.last4 || ''
  const vpa = order.paymentDetails?.vpa || ''

  if (last4 && method.toLowerCase().includes('card')) {
    return `${method} ···· ${last4}`
  }
  if (vpa && method.toLowerCase().includes('upi')) {
    return `${method} (${vpa})`
  }
  if (last4) {
    return `${method} ···· ${last4}`
  }
  return method
}

export const toCategorySlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const productMatchesCategory = (product, categoryOrSlug) => {
  if (!product || !categoryOrSlug) return false
  if (categoryOrSlug === 'all') return true

  const isObj = typeof categoryOrSlug === 'object'
  const slug = toCategorySlug(isObj ? categoryOrSlug.slug : categoryOrSlug)
  const catObjectId = isObj ? categoryOrSlug._id : null
  const catTitleLower = isObj
    ? String(categoryOrSlug.title || '').trim().toLowerCase()
    : ''

  if (catObjectId && product.categoryRef === catObjectId) return true
  if (slug && product.department?.toLowerCase() === slug) return true
  if (
    slug &&
    Array.isArray(product.tags) &&
    product.tags.some((t) => String(t).toLowerCase() === slug)
  ) {
    return true
  }
  if (slug && toCategorySlug(product.category) === slug) return true
  if (
    catTitleLower &&
    String(product.category || '').trim().toLowerCase() === catTitleLower
  ) {
    return true
  }
  return false
}

