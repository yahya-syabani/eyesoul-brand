import { TCollection } from '@/data/data'
import Image from 'next/image'
import { FC } from 'react'
import { Link } from './Link'

interface Props {
  className?: string
  collections: TCollection[]
  headingDim?: string
  heading?: string
}

const SectionBentoGrid: FC<Props> = ({
  className = '',
  collections,
  headingDim = 'Good things are waiting for you',
  heading = 'Discover more',
}) => {
  if (!collections || collections.length === 0) return null

  // Ensure we only use up to 4 or 5 collections for a bento box, depending on design
  const items = collections.slice(0, 4)

  return (
    <div className={`relative ${className}`}>
      <div className="container mb-12 text-center lg:mb-16">
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-neutral-900 dark:text-neutral-50 mb-4 fade--animation__heading">
          {heading}
        </h2>
        {headingDim && <span className="text-neutral-500 block fade--animation__subheading">{headingDim}</span>}
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {items.map((collection, index) => {
            if (!collection.handle) return null

            // Determine bento sizing: first item is large, others are smaller tiles
            const isLarge = index === 0
            const colSpan = isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
            const minHeight = isLarge ? 'min-h-[400px] md:min-h-[500px]' : 'min-h-[250px] md:min-h-[240px]'

            return (
              <div
                key={collection.id}
                className={`group relative overflow-hidden rounded-3xl ${colSpan} ${minHeight} bg-neutral-100 dark:bg-neutral-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block`}
              >
                <Link href={'/collections/' + collection.handle} className="absolute inset-0 z-20" />
                
                {/* Background Color Base */}
                <div className={`absolute inset-0 ${collection.color || 'bg-neutral-100'} opacity-30 dark:opacity-10 mix-blend-multiply`} />

                {/* Content */}
                <div className="absolute inset-x-6 top-6 z-10">
                  <span className="block text-sm font-medium tracking-wider uppercase text-neutral-600 dark:text-neutral-400 mb-2">
                    {collection.title}
                  </span>
                  {collection.description && (
                    <h3
                      className={`font-semibold text-neutral-900 dark:text-white ${isLarge ? 'text-3xl md:text-4xl max-w-sm' : 'text-xl'}`}
                      dangerouslySetInnerHTML={{ __html: collection.sortDescription ?? collection.title ?? '' }}
                    ></h3>
                  )}
                </div>

                {/* Explore button - appears on hover */}
                <div className="absolute bottom-6 left-6 z-10 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="inline-flex items-center justify-center rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-medium shadow-lg hover:bg-neutral-100">
                    Explore Collection
                  </span>
                </div>

                {/* Image */}
                {collection.image && (
                  <div className={`absolute ${isLarge ? 'right-0 bottom-0 w-2/3 h-5/6 max-w-[400px]' : 'right-0 bottom-0 w-3/4 h-3/4 max-w-[200px]'}`}>
                    <Image
                      alt={collection.image.alt ?? collection.title}
                      src={collection.image}
                      fill
                      className="object-contain object-bottom-right drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2"
                      sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
                    />
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SectionBentoGrid
