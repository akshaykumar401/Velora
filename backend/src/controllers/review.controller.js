import { findProductByIdOrSlug } from '../models/product.model.js'
import { Review } from '../models/review.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { fetchProductReviewsForViewer } from '../utils/reviewHelpers.js'
import { serializeReview } from '../utils/serializers.js'

export const getProductReviews = asyncHandler(async (req, res) => {
  const { productSlug } = req.params
  const product = await findProductByIdOrSlug(productSlug)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const reviews = await fetchProductReviewsForViewer(product, req.user)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        reviews.map(serializeReview),
        'Product reviews fetched successfully',
      ),
    )
})

export const createProductReview = asyncHandler(async (req, res) => {
  const { productSlug } = req.params
  const { rating, comment } = req.body

  const numericRating = Number(rating)
  if (
    !Number.isFinite(numericRating) ||
    numericRating < 1 ||
    numericRating > 5 ||
    !comment?.trim()
  ) {
    throw new ApiError(
      400,
      'Valid rating (1-5) and review comment are required',
    )
  }

  const product = await findProductByIdOrSlug(productSlug)
  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  const created = await Review.create({
    product: product._id,
    productSlug: product.slug,
    productName: product.name,
    user: req.user._id,
    author: req.user.fullName || 'Velora Client',
    rating: Math.round(numericRating),
    comment: comment.trim(),
    status: 'Pending',
  })

  const review = await Review.findById(created._id)
    .populate('product', 'name slug image')
    .populate('user', 'fullName')

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        serializeReview(review),
        'Review submitted for atelier moderation',
      ),
    )
})
