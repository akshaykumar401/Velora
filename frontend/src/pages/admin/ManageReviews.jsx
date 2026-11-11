import { useMemo, useState } from 'react'
import {
  RiCheckLine,
  RiDeleteBinLine,
  RiEyeOffLine,
  RiStarFill,
  RiStarLine,
} from '@remixicon/react'
import { AdminPageHeader } from '../../components/admin'
import { useAdmin } from '../../features/admin/adminContext.js'

const REVIEW_FILTERS = ['All', 'Published', 'Pending', 'Hidden']

const ManageReviews = () => {
  const { reviews, updateReviewStatus, deleteReview } = useAdmin()
  const [filter, setFilter] = useState('All')

  const visibleReviews = useMemo(
    () =>
      filter === 'All'
        ? reviews
        : reviews.filter((review) => review.status === filter),
    [reviews, filter],
  )

  return (
    <div>
      <AdminPageHeader
        eyebrow="MODERATION"
        title="Manage Reviews"
        subtitle="Approve verified client feedback before publishing or hide off-topic entries."
      />

      {/* Status Filter Tabs */}
      <div className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {REVIEW_FILTERS.map((status) => {
          const active = filter === status
          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? 'bg-[#151413] text-[#FCF9F2] font-medium'
                  : 'bg-[#F3EFE6] text-[#68635B] hover:text-[#1A1816]'
              }`}
            >
              {status}
            </button>
          )
        })}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {visibleReviews.length === 0 ? (
          <div className="border border-[#EAE5DC] bg-[#F6F3EC] p-10 text-center text-[13px] text-[#6D6860]">
            No reviews found under “{filter}”.
          </div>
        ) : (
          visibleReviews.map((review) => (
            <article
              key={review.id}
              className="border border-[#E5DFD3] bg-[#FCF9F2] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 bg-[#F3EFE6] text-[10px] tracking-[0.16em] uppercase text-[#1A1816]">
                    {review.status}
                  </span>
                  <div
                    className="flex items-center gap-0.5 text-[#1A1816]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= review.rating ? (
                        <RiStarFill key={star} size={13} aria-hidden="true" />
                      ) : (
                        <RiStarLine key={star} size={13} aria-hidden="true" />
                      ),
                    )}
                  </div>
                  <span className="text-[11.5px] text-[#78736B]">
                    {review.createdAt}
                  </span>
                </div>

                <h2 className="font-serif text-[19px] text-[#1A1816] mb-1">
                  {review.productName}
                </h2>
                <p className="text-[13px] leading-[1.7] text-[#5E5951] mb-2">
                  “{review.comment}”
                </p>
                <p className="text-[11.5px] text-[#8A8379]">
                  Submitted by {review.author}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {review.status !== 'Published' && (
                  <button
                    type="button"
                    onClick={() => updateReviewStatus(review.id, 'Published')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#151413] text-[#FCF9F2] text-[10.5px] tracking-[0.14em] uppercase hover:bg-[#2B2825] cursor-pointer"
                  >
                    <RiCheckLine size={13} aria-hidden="true" />
                    <span>Publish</span>
                  </button>
                )}

                {review.status !== 'Hidden' && (
                  <button
                    type="button"
                    onClick={() => updateReviewStatus(review.id, 'Hidden')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#D8D1C5] text-[#1A1816] text-[10.5px] tracking-[0.14em] uppercase hover:border-[#1A1816] cursor-pointer"
                  >
                    <RiEyeOffLine size={13} aria-hidden="true" />
                    <span>Hide</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => deleteReview(review.id)}
                  aria-label={`Delete review by ${review.author}`}
                  className="p-2 text-[#7A5448] hover:text-[#1A1816] cursor-pointer"
                >
                  <RiDeleteBinLine size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageReviews

