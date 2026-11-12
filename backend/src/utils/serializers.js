import { DEFAULT_STOREFRONT_SETTINGS } from '../models/siteSettings.model.js'

export const serializeProduct = (doc, reviewStats = null) => {
  if (!doc) return null
  const reviewCount = reviewStats?.reviewCount ?? 0
  const averageRating =
    reviewCount > 0 && reviewStats?.averageRating != null
      ? Math.round(Number(reviewStats.averageRating) * 10) / 10
      : 0

  return {
    _id: doc._id.toString(),
    id: doc.slug,
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    department: doc.department,
    categoryRef: doc.categoryRef ? doc.categoryRef.toString() : null,
    tags: doc.tags || [],
    price: doc.price,
    description: doc.description,
    fabric: doc.fabric || '',
    care: doc.care || '',
    sizes: doc.sizes || ['One Size'],
    colors: doc.colors || [],
    image: doc.image || null,
    placeholderTone: doc.placeholderTone,
    featuredOrder: doc.featuredOrder ?? 99,
    stock: doc.stock ?? 25,
    reviewCount,
    averageRating,
    to: `/product/${doc.slug}`,
  }
}

export const serializeCategory = (doc, itemCount = 0) => {
  if (!doc) return null
  return {
    _id: doc._id.toString(),
    id: doc.slug,
    slug: doc.slug,
    indexLabel: doc.indexLabel,
    title: doc.title,
    subtitle: doc.subtitle || '',
    featured: Boolean(doc.featured),
    image: doc.image || null,
    placeholderBg: doc.placeholderBg,
    itemCount,
    to: `/shop?category=${doc.slug}`,
  }
}

export const serializeOrder = (doc) => {
  if (!doc) return null
  return {
    _id: doc._id.toString(),
    id: doc.orderNumber,
    orderNumber: doc.orderNumber,
    customerName: doc.customerName,
    customerEmail: doc.customerEmail,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString().slice(0, 10)
      : '',
    status: doc.status,
    deliveryMethod: doc.deliveryMethod,
    paymentMethod:
      doc.paymentMethod || (doc.paymentLast4 ? 'Card' : 'Razorpay'),
    paymentStatus: doc.paymentStatus || 'Paid',
    paymentLast4: doc.paymentLast4 || doc.paymentDetails?.last4 || '',
    paymentDetails: doc.paymentDetails
      ? {
          gateway: doc.paymentDetails.gateway || 'razorpay',
          razorpayOrderId: doc.paymentDetails.razorpayOrderId || '',
          razorpayPaymentId: doc.paymentDetails.razorpayPaymentId || '',
          method: doc.paymentDetails.method || '',
          last4: doc.paymentDetails.last4 || '',
          network: doc.paymentDetails.network || '',
          vpa: doc.paymentDetails.vpa || '',
          bank: doc.paymentDetails.bank || '',
          wallet: doc.paymentDetails.wallet || '',
        }
      : null,
    shippingAddress: doc.shippingAddress,
    items: (doc.items || []).map((item) => ({
      productId: item.productSlug,
      name: item.name,
      category: item.category,
      price: item.price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    })),
    subtotal: doc.subtotal,
    shippingFee: doc.shippingFee,
    total: doc.total,
  }
}

export const serializeReview = (doc) => {
  if (!doc) return null
  const populatedProduct =
    doc.product && typeof doc.product === 'object' && doc.product.slug
      ? doc.product
      : null
  const populatedUser =
    doc.user && typeof doc.user === 'object' && doc.user.fullName
      ? doc.user
      : null

  return {
    id: doc._id.toString(),
    productId: populatedProduct?.slug || doc.productSlug,
    productObjectId:
      populatedProduct?._id?.toString() || doc.product?.toString() || null,
    productName: populatedProduct?.name || doc.productName,
    productImage: populatedProduct?.image || null,
    userId: populatedUser?._id?.toString() || doc.user?.toString() || null,
    author: populatedUser?.fullName || doc.author,
    rating: doc.rating,
    comment: doc.comment,
    status: doc.status,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString().slice(0, 10)
      : '',
  }
}

export const serializeUser = (doc) => {
  if (!doc) return null
  return {
    _id: doc._id.toString(),
    clerkId: doc.clerkId || null,
    fullName: doc.fullName,
    email: doc.email,
    role: doc.role,
    title: doc.title || '',
    studio: doc.studio || '',
    avatarUrl: doc.avatarUrl || '',
    phone: doc.phone || '',
    preferredSize: doc.preferredSize || 'M',
    newsletterOptIn: Boolean(doc.newsletterOptIn),
    addresses: (doc.addresses || []).map((addr) => ({
      id: addr._id.toString(),
      label: addr.label,
      recipient: addr.recipient,
      street: addr.street,
      city: addr.city,
      region: addr.region,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || '',
      isDefault: Boolean(addr.isDefault),
    })),
    wishlistIds: (doc.wishlist || []).map((item) =>
      typeof item === 'object' && item.slug ? item.slug : item.toString(),
    ),
    cartItems: (doc.cart || [])
      .filter((entry) => entry.product)
      .map((entry) => {
        const prod = entry.product
        const productId = prod.slug || prod.toString()
        const key = `${productId}__${entry.size || 'One Size'}__${entry.color || 'Default'}`
        return {
          _id: entry._id.toString(),
          key,
          productId,
          size: entry.size || 'One Size',
          color: entry.color || 'Default',
          quantity: entry.quantity,
          product: typeof prod === 'object' && prod.name ? serializeProduct(prod) : null,
        }
      }),
  }
}

export const serializeSiteSettings = (doc) => ({
  heroImage: doc?.heroImage || DEFAULT_STOREFRONT_SETTINGS.heroImage,
  heroEyebrow: doc?.heroEyebrow || DEFAULT_STOREFRONT_SETTINGS.heroEyebrow,
  heroTitle: doc?.heroTitle || DEFAULT_STOREFRONT_SETTINGS.heroTitle,
  heroSubtitle: doc?.heroSubtitle || DEFAULT_STOREFRONT_SETTINGS.heroSubtitle,
  philosophyImage:
    doc?.philosophyImage || DEFAULT_STOREFRONT_SETTINGS.philosophyImage,
  isHeroCustomized: Boolean(doc),
})

