import { findProductByIdOrSlug, Product } from '../models/product.model.js'
import { Review } from '../models/review.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  buildCategoryProductFilter,
  findCategoryByIdentifier,
  resolveMatchingCategory,
} from '../utils/categoryHelpers.js'
import {
  removeLocalFile,
  resolveUploadedImage,
} from '../utils/cloudinary.js'
import { buildNewProductAnnouncementEmail } from '../utils/emailTemplates.js'
import {
  getStorefrontOrigin,
  getSubscribedRecipientEmails,
  isMailServiceEnabled,
  notifyInBackground,
  sendMailToMany,
} from '../utils/mailService.js'
import {
  computePublishedReviewStatsMap,
  fetchProductReviewsForViewer,
} from '../utils/reviewHelpers.js'
import { serializeProduct, serializeReview } from '../utils/serializers.js'

const parseArrayField = (value, fallback = []) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return fallback
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }
  return fallback
}

const parseStockValue = (value, defaultValue = 25) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return defaultValue
  }
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ApiError(400, 'Total stock must be a non-negative integer')
  }
  return Math.floor(parsed)
}

export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort = 'featured' } = req.query

  const query = {}
  if (category && category !== 'all') {
    const normalized = String(category).trim().toLowerCase()
    const matchedCat = await findCategoryByIdentifier(normalized)
    Object.assign(query, buildCategoryProductFilter(matchedCat, normalized))
  }

  if (search && String(search).trim()) {
    const regex = new RegExp(String(search).trim(), 'i')
    query.$and = [
      ...(query.$and || []),
      {
        $or: [{ name: regex }, { category: regex }, { description: regex }],
      },
    ]
  }

  const sortMap = {
    featured: { featuredOrder: 1, createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'name-asc': { name: 1 },
  }

  const products = await Product.find(query)
    .sort(sortMap[sort] || sortMap.featured)
    .lean()
  const statsMap = await computePublishedReviewStatsMap(
    products.map((p) => p._id),
  )

  return res.status(200).json(
    new ApiResponse(
      200,
      products.map((prod) =>
        serializeProduct(prod, statsMap.get(prod._id.toString())),
      ),
      'Products fetched successfully',
    ),
  )
})

export const getProductDetail = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params
  const product = await findProductByIdOrSlug(idOrSlug)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const [reviews, relatedDocs] = await Promise.all([
    fetchProductReviewsForViewer(product, req.user),
    Product.find({ slug: { $ne: product.slug } })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(16)
      .lean(),
  ])

  const prioritized = [
    ...relatedDocs.filter(
      (item) =>
        item.department === product.department ||
        item.category === product.category,
    ),
    ...relatedDocs.filter(
      (item) =>
        item.department !== product.department &&
        item.category !== product.category,
    ),
  ].slice(0, 4)

  const statsMap = await computePublishedReviewStatsMap([
    product._id,
    ...prioritized.map((item) => item._id),
  ])

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        product: serializeProduct(
          product,
          statsMap.get(product._id.toString()),
        ),
        reviews: reviews.map(serializeReview),
        relatedProducts: prioritized.map((item) =>
          serializeProduct(item, statsMap.get(item._id.toString())),
        ),
      },
      'Product fetched successfully',
    ),
  )
})

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    department,
    tags,
    price,
    description,
    fabric,
    care,
    sizes,
    colors,
    image,
    placeholderTone,
    stock,
  } = req.body

  if (!name?.trim() || !category?.trim() || !department?.trim() || price == null) {
    removeLocalFile(req.file?.path)
    throw new ApiError(400, 'Name, category, department, and price are required')
  }

  let parsedStock
  try {
    parsedStock = parseStockValue(stock, 25)
  } catch (err) {
    removeLocalFile(req.file?.path)
    throw err
  }

  const parsedPrice = Number(price)
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    removeLocalFile(req.file?.path)
    throw new ApiError(400, 'Price must be a valid non-negative amount')
  }

  const baseSlug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`

  const parsedTags = parseArrayField(tags, [department.trim().toLowerCase()])
  const parsedSizes = parseArrayField(sizes, ['One Size'])
  const parsedColors = parseArrayField(colors, [])
  const resolvedImage = await resolveUploadedImage(
    req.file,
    image,
    'velora/products',
  )

  const normalizedDept = department.trim().toLowerCase()
  const matchedCategory = await resolveMatchingCategory({
    department: normalizedDept,
    category,
  })
  const mergedTags = Array.from(
    new Set([
      ...(parsedTags.length > 0 ? parsedTags : [normalizedDept]),
      ...(matchedCategory?.slug ? [matchedCategory.slug] : []),
    ]),
  )

  const created = await Product.create({
    slug,
    name: name.trim(),
    category: category.trim().toUpperCase(),
    department: normalizedDept,
    categoryRef: matchedCategory?._id || null,
    tags: mergedTags,
    price: parsedPrice,
    description: description?.trim() || 'Crafted in small batches at the Velora atelier.',
    fabric: fabric?.trim() || '',
    care: care?.trim() || '',
    sizes: parsedSizes.length > 0 ? parsedSizes : ['One Size'],
    colors: parsedColors,
    image: resolvedImage,
    placeholderTone:
      placeholderTone || 'bg-gradient-to-b from-[#EDE7DD] to-[#E2DACD]',
    featuredOrder: 0,
    stock: parsedStock,
  })

  const shouldNotifySubscribers =
    req.body.notifySubscribers === undefined
      ? true
      : !(
          req.body.notifySubscribers === false ||
          String(req.body.notifySubscribers).trim().toLowerCase() === 'false'
        )

  const serialized = serializeProduct(created)
  let notifiedSubscribersCount = 0

  if (shouldNotifySubscribers && isMailServiceEnabled()) {
    const subscriberEmails = await getSubscribedRecipientEmails()
    notifiedSubscribersCount = subscriberEmails.length
    if (subscriberEmails.length > 0) {
      notifyInBackground(async () => {
        const emailContent = buildNewProductAnnouncementEmail({
          product: serialized,
          storefrontOrigin: getStorefrontOrigin(),
        })
        await sendMailToMany({
          recipients: subscriberEmails,
          ...emailContent,
          context: `new-product:${created.slug}`,
        })
      }, `new-product:${created.slug}`)
    }
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        ...serialized,
        notifiedSubscribersCount,
      },
      'Product created successfully',
    ),
  )
})

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await findProductByIdOrSlug(id)

  if (!product) {
    removeLocalFile(req.file?.path)
    throw new ApiError(404, 'Product not found')
  }

  const allowedFields = [
    'name',
    'category',
    'department',
    'tags',
    'price',
    'description',
    'fabric',
    'care',
    'sizes',
    'colors',
    'stock',
  ]

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      if (field === 'price') {
        const nextPrice = Number(req.body.price)
        if (!Number.isFinite(nextPrice) || nextPrice < 0) {
          removeLocalFile(req.file?.path)
          throw new ApiError(400, 'Price must be a valid non-negative amount')
        }
        product.price = nextPrice
      } else if (field === 'stock') {
        try {
          product.stock = parseStockValue(req.body.stock, product.stock)
        } catch (err) {
          removeLocalFile(req.file?.path)
          throw err
        }
      } else if (field === 'tags' || field === 'sizes' || field === 'colors') {
        product[field] = parseArrayField(req.body[field], product[field])
      } else {
        product[field] = req.body[field]
      }
    }
  }

  if (req.body.department !== undefined || req.body.category !== undefined) {
    const matchedCategory = await resolveMatchingCategory({
      department: product.department,
      category: product.category,
    })
    product.categoryRef = matchedCategory?._id || null
    if (matchedCategory?.slug && !product.tags.includes(matchedCategory.slug)) {
      product.tags = [...product.tags, matchedCategory.slug]
    }
  }

  if (req.file || req.body.image !== undefined) {
    product.image = await resolveUploadedImage(
      req.file,
      req.body.image,
      'velora/products',
    )
  }

  await product.save()

  if (req.body.name !== undefined) {
    await Review.updateMany(
      { $or: [{ product: product._id }, { productSlug: product.slug }] },
      { productName: product.name, productSlug: product.slug },
    )
  }

  const statsMap = await computePublishedReviewStatsMap([product._id])

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeProduct(product, statsMap.get(product._id.toString())),
        'Product updated successfully',
      ),
    )
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await findProductByIdOrSlug(id)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  await Review.deleteMany({
    $or: [{ product: product._id }, { productSlug: product.slug }],
  })
  await product.deleteOne()

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id: product.slug },
        'Product deleted successfully',
      ),
    )
})

