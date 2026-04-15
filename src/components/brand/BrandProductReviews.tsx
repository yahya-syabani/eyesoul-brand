import type { ProductReview } from '@/payload-types'

import { StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

import { formatCmsPostDate } from '@/lib/cms/postMappers'

import { BrandRichText } from './BrandRichText'

export function aggregateFromReviews(reviews: ProductReview[]): { rating: number; count: number } {
  if (!reviews.length) return { rating: 0, count: 0 }
  const sum = reviews.reduce((s, r) => s + r.rating, 0)
  return { rating: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length }
}

export function BrandProductReviews({ reviews }: { reviews: ProductReview[] }) {
  const { rating, count } = aggregateFromReviews(reviews)

  if (!count) {
    return (
      <section aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="flex scroll-mt-8 items-center text-2xl font-semibold">
          <StarIcon className="mb-0.5 size-7" aria-hidden />
          <span className="ml-1.5">Reviews</span>
        </h2>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">No reviews yet for this product.</p>
      </section>
    )
  }

  return (
    <section aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="flex scroll-mt-8 items-center text-2xl font-semibold">
        <StarIcon className="mb-0.5 size-7" aria-hidden />
        <span className="ml-1.5">
          {rating} · {count} {count === 1 ? 'review' : 'reviews'}
        </span>
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-11 md:grid-cols-2 lg:gap-x-28">
        {reviews.map((review) => (
          <article key={review.id} className="flex flex-col">
            <div className="flex gap-x-4">
              <div className="flex flex-1 justify-between gap-4">
                <div className="text-sm sm:text-base">
                  <span className="block font-semibold">{review.authorName}</span>
                  {review.verified ? (
                    <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">Verified</span>
                  ) : null}
                  <span className="mt-0.5 block text-sm text-neutral-500 dark:text-neutral-400">
                    {formatCmsPostDate(review.createdAt)}
                  </span>
                </div>
                <div className="mt-0.5 flex shrink-0 text-yellow-500" aria-label={`${review.rating} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon
                      key={i}
                      aria-hidden
                      className={clsx(
                        review.rating > i ? 'text-yellow-400' : 'text-gray-200 dark:text-neutral-600',
                        'size-5 shrink-0',
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            {review.title ? <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">{review.title}</h3> : null}
            <div className="prose prose-sm mt-3 max-w-2xl sm:prose dark:prose-invert">
              <BrandRichText data={review.body} className="text-neutral-600 dark:text-neutral-300" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
