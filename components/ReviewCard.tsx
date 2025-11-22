import { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const rating = parseInt(review.metadata.rating.key)
  const reviewDate = review.metadata.review_date
    ? new Date(review.metadata.review_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      {/* Rating & Verified Badge */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 ${index < rating ? 'fill-current' : 'fill-gray-300'}`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        {review.metadata.verified_purchase && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
            Verified Purchase
          </span>
        )}
      </div>

      {/* Review Title */}
      {review.metadata.review_title && (
        <h4 className="font-semibold text-lg mb-2">
          {review.metadata.review_title}
        </h4>
      )}

      {/* Review Content */}
      <p className="text-gray-700 mb-3">
        {review.metadata.review_content}
      </p>

      {/* Reviewer Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">{review.metadata.reviewer_name}</span>
        {reviewDate && (
          <>
            <span>•</span>
            <span>{reviewDate}</span>
          </>
        )}
      </div>
    </div>
  )
}