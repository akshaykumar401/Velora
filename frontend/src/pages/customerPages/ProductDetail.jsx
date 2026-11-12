import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  RiArrowRightSLine,
  RiCheckLine,
  RiStarFill,
  RiStarLine,
} from '@remixicon/react'
import { useAppDispatch, useAppSelector } from '../../App/hooks.js'
import {
  fetchProductDetail,
  submitProductReview,
} from '../../features/catalog/catalogSlice.js'
import { useAuthStatus } from '../../features/auth/authContext.js'
import {
  ProductGallery,
  ProductInfo,
  RelatedProducts,
} from '../../components/product'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { isSignedIn } = useAuthStatus()
  const {
    activeProduct,
    activeReviews,
    relatedProducts,
    detailStatus,
    reviewSubmitStatus,
  } = useAppSelector((state) => state.catalog)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittedProductSlug, setSubmittedProductSlug] = useState('')
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(id))
    }
  }, [dispatch, id, isSignedIn])

  const product =
    activeProduct?.id === id || activeProduct?._id === id
      ? activeProduct
      : null
  const reviewSubmitted = Boolean(product && submittedProductSlug === product.id)

  const publishedReviews = activeReviews.filter(
    (review) => review.status === 'Published',
  )
  const ratingAverage =
    product?.averageRating ||
    (publishedReviews.length > 0
      ? Math.round(
          (publishedReviews.reduce((sum, r) => sum + r.rating, 0) /
            publishedReviews.length) *
            10,
        ) / 10
      : 0)

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim() || !product) return
    setReviewError('')
    try {
      await dispatch(
        submitProductReview({
          productSlug: product.id,
          rating,
          comment: comment.trim(),
        }),
      ).unwrap()
      setComment('')
      setSubmittedProductSlug(product.id)
    } catch (err) {
      setReviewError(err || 'Unable to submit review right now')
    }
  }

  if (detailStatus === 'loading' && !product) {
    return (
      <section className="py-24 bg-[#FCF9F2] text-center">
        <p className="text-[11px] tracking-[0.22em] uppercase text-[#8A8379]">
          LOADING PIECE...
        </p>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="py-24 sm:py-32 bg-[#FCF9F2]">
        <div className="max-w-[520px] mx-auto px-5 text-center">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-2">
            ARCHIVE LOOKUP
          </p>
          <h1 className="font-serif text-[32px] text-[#1A1816] mb-3">
            Piece not found
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#6D6860] mb-8">
            The garment or accessory you requested is currently not in the catalog.
          </p>
          <Link
            to="/shop"
            className="inline-block px-7 py-3.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors"
          >
            RETURN TO COLLECTION
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-10 sm:py-14 lg:py-16 bg-[#FCF9F2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-[#8A8379] mb-8 min-w-0"
          >
            <Link to="/" className="hover:text-[#1A1816] transition-colors">
              Home
            </Link>
            <RiArrowRightSLine size={14} aria-hidden="true" className="shrink-0" />
            <Link to="/shop" className="hover:text-[#1A1816] transition-colors">
              Shop
            </Link>
            <RiArrowRightSLine size={14} aria-hidden="true" className="shrink-0" />
            <span className="text-[#1A1816] truncate max-w-full">{product.name}</span>
          </nav>

          {/* 2-Column Product Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-6 min-w-0">
              <ProductGallery product={product} />
            </div>
            <div className="lg:col-span-6 min-w-0">
              <ProductInfo key={product.id} product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* Client Reviews Section */}
      <section className="py-14 sm:py-16 bg-[#FCF9F2] border-t border-[#EAE5DC]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 min-w-0">
              <p className="text-[10px] tracking-[0.24em] uppercase text-[#8A8379] mb-1.5">
                CLIENT IMPRESSIONS
              </p>
              <div className="flex flex-wrap items-baseline gap-4 mb-6">
                <h2 className="font-serif text-[26px] sm:text-[30px] font-normal text-[#1A1816]">
                  Reviews ({publishedReviews.length})
                </h2>
                {ratingAverage > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-[#5E5951]">
                    <RiStarFill size={14} className="text-[#1A1816]" aria-hidden="true" />
                    <span>{ratingAverage} out of 5</span>
                  </span>
                )}
              </div>

              {activeReviews.length === 0 ? (
                <p className="text-[13px] text-[#6D6860]">
                  No published reviews for this piece yet.
                </p>
              ) : (
                <div className="divide-y divide-[#EAE5DC] border-t border-[#EAE5DC]">
                  {activeReviews.map((review) => (
                    <article key={review.id} className="py-5">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex items-center gap-0.5 text-[#1A1816]">
                          {[1, 2, 3, 4, 5].map((star) =>
                            star <= review.rating ? (
                              <RiStarFill key={star} size={13} aria-hidden="true" />
                            ) : (
                              <RiStarLine key={star} size={13} aria-hidden="true" />
                            ),
                          )}
                        </div>
                        <span className="text-[12px] font-medium text-[#1A1816]">
                          {review.author}
                        </span>
                        <span className="text-[11px] text-[#8A8379]">
                          {review.createdAt}
                        </span>
                        {review.status === 'Pending' && (
                          <span className="px-2 py-0.5 bg-[#F3EFE6] text-[9.5px] tracking-[0.14em] uppercase text-[#78736B]">
                            Pending Moderation
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] leading-[1.7] text-[#5E5951]">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 min-w-0">
              {isSignedIn ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-[#F6F3EC] border border-[#EAE5DC] p-5 sm:p-6 space-y-4"
                >
                  <h3 className="font-serif text-[20px] text-[#1A1816]">
                    Leave a Review
                  </h3>

                  <div>
                    <span className="block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-2">
                      Rating
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          aria-label={`Rate ${star} stars`}
                          className="text-[#1A1816] cursor-pointer"
                        >
                          {star <= rating ? (
                            <RiStarFill size={18} aria-hidden="true" />
                          ) : (
                            <RiStarLine size={18} aria-hidden="true" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="product-review-comment"
                      className="block text-[10px] tracking-[0.18em] uppercase text-[#78736B] mb-1.5"
                    >
                      Your Note
                    </label>
                    <textarea
                      id="product-review-comment"
                      rows={3}
                      required
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value)
                        if (reviewSubmitted) setSubmittedProductSlug('')
                      }}
                      placeholder="Share how this piece wears and drapes..."
                      className="w-full min-w-0 bg-[#FCF9F2] border border-[#D8D1C5] px-3.5 py-2.5 text-[13px] text-[#1A1816] focus:border-[#1A1816] focus:outline-none"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-[12px] text-[#7A3528]">{reviewError}</p>
                  )}

                  {reviewSubmitted && (
                    <p className="text-[12px] text-[#354E3A]">
                      Thank you — your review is queued for atelier moderation.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSubmitStatus === 'loading'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#2B2825] transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {reviewSubmitStatus === 'loading' ? (
                      <span>SUBMITTING...</span>
                    ) : reviewSubmitted ? (
                      <>
                        <RiCheckLine size={14} aria-hidden="true" />
                        <span>SUBMITTED FOR REVIEW</span>
                      </>
                    ) : (
                      <span>SUBMIT REVIEW</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-[#F6F3EC] border border-[#EAE5DC] p-6">
                  <h3 className="font-serif text-[20px] text-[#1A1816] mb-2">
                    Share Your Experience
                  </h3>
                  <p className="text-[12.5px] leading-[1.65] text-[#666058] mb-4">
                    Sign in to submit a verified client review for this piece.
                  </p>
                  <Link
                    to="/sign-in"
                    state={{ from: `/product/${product.id}` }}
                    className="inline-block px-5 py-2.5 bg-[#0F0E0D] text-[#FCF9F2] text-[10.5px] font-medium tracking-[0.18em] uppercase"
                  >
                    SIGN IN TO REVIEW
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts} />
    </>
  )
}

export default ProductDetail
