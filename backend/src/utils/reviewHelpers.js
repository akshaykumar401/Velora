import { Review } from '../models/review.model.js'

export const fetchProductReviewsForViewer = async (product, viewerUser) => {
  const productMatch = {
    $or: [{ product: product._id }, { productSlug: product.slug }],
  }

  const visibilityFilter = viewerUser?._id
    ? {
        $or: [
          { status: 'Published' },
          { status: 'Pending', user: viewerUser._id },
        ],
      }
    : { status: 'Published' }

  return Review.find({ $and: [productMatch, visibilityFilter] })
    .populate('product', 'name slug image')
    .populate('user', 'fullName')
    .sort({ createdAt: -1 })
}

export const computePublishedReviewStatsMap = async (productIds = []) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return new Map()
  }

  const rows = await Review.aggregate([
    {
      $match: {
        status: 'Published',
        product: { $in: productIds },
      },
    },
    {
      $group: {
        _id: '$product',
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ])

  return new Map(
    rows.map((row) => [
      row._id.toString(),
      {
        reviewCount: row.reviewCount,
        averageRating: row.averageRating,
      },
    ]),
  )
}

