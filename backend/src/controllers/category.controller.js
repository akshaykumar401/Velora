import { Category } from '../models/category.model.js'
import { Product } from '../models/product.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  buildCategoryProductFilter,
  countProductsForCategories,
  findCategoryByIdentifier,
  toSlug,
} from '../utils/categoryHelpers.js'
import {
  removeLocalFile,
  resolveUploadedImage,
} from '../utils/cloudinary.js'
import { serializeCategory } from '../utils/serializers.js'

const parseBooleanField = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true'
  return Boolean(value)
}

export const getCategories = asyncHandler(async (_req, res) => {
  const [categories, products] = await Promise.all([
    Category.find().sort({ createdAt: 1 }).lean(),
    Product.find({}, 'category department categoryRef tags').lean(),
  ])

  const counts = countProductsForCategories(categories, products)

  const data = categories.map((cat) =>
    serializeCategory(cat, counts.get(cat.slug) || 0),
  )

  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Categories fetched successfully'))
})

export const createCategory = asyncHandler(async (req, res) => {
  const { title, slug, indexLabel, subtitle, featured, image, placeholderBg } =
    req.body

  if (!title?.trim()) {
    removeLocalFile(req.file?.path)
    throw new ApiError(400, 'Category title is required')
  }

  const normalizedSlug = toSlug(slug?.trim() || title)
  if (!normalizedSlug) {
    removeLocalFile(req.file?.path)
    throw new ApiError(400, 'A valid URL slug is required')
  }

  const existing = await Category.findOne({ slug: normalizedSlug })
  if (existing) {
    removeLocalFile(req.file?.path)
    throw new ApiError(409, 'A category with this slug already exists')
  }

  const resolvedImage = await resolveUploadedImage(
    req.file,
    image,
    'velora/categories',
  )

  const created = await Category.create({
    title: title.trim(),
    slug: normalizedSlug,
    indexLabel: indexLabel?.trim() || '01 / COLLECTION',
    subtitle: subtitle?.trim() || '',
    featured: parseBooleanField(featured),
    image: resolvedImage,
    placeholderBg:
      placeholderBg ||
      'bg-gradient-to-br from-[#D9CFC2] via-[#AFA190] to-[#5E5247]',
  })

  // Link any existing matching products (created earlier with matching department/title/tag)
  const matchFilter = buildCategoryProductFilter(created, created.slug)
  if (matchFilter.$or) {
    await Product.updateMany(matchFilter, {
      $set: { categoryRef: created._id },
      $addToSet: { tags: created.slug },
    })
  }

  const itemCount = await Product.countDocuments(
    buildCategoryProductFilter(created, created.slug),
  )

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        serializeCategory(created, itemCount),
        'Category created successfully',
      ),
    )
})

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  const category = await findCategoryByIdentifier(id)

  if (!category) {
    removeLocalFile(req.file?.path)
    throw new ApiError(404, 'Category not found')
  }

  const previousSlug = category.slug
  const { title, slug, indexLabel, subtitle, featured, image, placeholderBg } =
    req.body

  if (title !== undefined) {
    const trimmed = String(title).trim()
    if (!trimmed) {
      removeLocalFile(req.file?.path)
      throw new ApiError(400, 'Category title is required')
    }
    category.title = trimmed
  }

  if (slug !== undefined) {
    const normalizedSlug = toSlug(slug)
    if (!normalizedSlug) {
      removeLocalFile(req.file?.path)
      throw new ApiError(400, 'A valid URL slug is required')
    }
    if (normalizedSlug !== category.slug) {
      const collision = await Category.findOne({
        slug: normalizedSlug,
        _id: { $ne: category._id },
      })
      if (collision) {
        removeLocalFile(req.file?.path)
        throw new ApiError(409, 'A category with this slug already exists')
      }
      category.slug = normalizedSlug
    }
  }

  if (indexLabel !== undefined) {
    category.indexLabel = String(indexLabel).trim() || category.indexLabel
  }
  if (subtitle !== undefined) {
    category.subtitle = String(subtitle).trim()
  }
  if (featured !== undefined) {
    category.featured = parseBooleanField(featured)
  }
  if (placeholderBg !== undefined) {
    category.placeholderBg = String(placeholderBg).trim() || category.placeholderBg
  }
  if (req.file || image !== undefined) {
    category.image = await resolveUploadedImage(
      req.file,
      image,
      'velora/categories',
    )
  }

  await category.save()

  if (category.slug !== previousSlug) {
    await Product.updateMany(
      { department: previousSlug },
      { $set: { department: category.slug } },
    )
    await Product.updateMany(
      { tags: previousSlug },
      { $addToSet: { tags: category.slug } },
    )
  }

  const itemCount = await Product.countDocuments(
    buildCategoryProductFilter(category, category.slug),
  )

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        serializeCategory(category, itemCount),
        'Category updated successfully',
      ),
    )
})

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await findCategoryByIdentifier(id)

  if (!target) {
    throw new ApiError(404, 'Category not found')
  }

  await Product.updateMany(
    { categoryRef: target._id },
    { $set: { categoryRef: null } },
  )
  await target.deleteOne()

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id: target.slug },
        'Category deleted successfully',
      ),
    )
})
