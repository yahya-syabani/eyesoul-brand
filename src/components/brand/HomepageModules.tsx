import type { CmsPost } from '@/lib/cms/posts'
import SectionCollectionSlider from '@/components/SectionCollectionSlider'
import SectionMagazine5 from '@/components/blog/SectionMagazine5'
import SectionSliderProductCard from '@/components/SectionSliderProductCard'
import { toTCollections, toTProductItems } from '@/lib/cms/adapters'
import { toBlogCardPost } from '@/lib/cms/postMappers'
import type { Homepage, Post, Product, ProductCollection } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'

import { normalizeExternalUrl } from '@/lib/links'

import { BrandHomeHero } from './BrandHomeHero'

type Module = NonNullable<Homepage['modules']>[number]

export function HomepageModules({ modules }: { modules: Homepage['modules'] }) {
  if (!modules?.length) return null

  return (
    <div className="relative flex flex-col gap-y-24 lg:gap-y-36">
      {modules.map((mod, index) => (
        <HomepageModule key={mod.id ?? `mod-${index}`} module={mod} />
      ))}
    </div>
  )
}

function HomepageModule({ module }: { module: Module }) {
  if (module.blockType === 'heroModule') {
    return (
      <div className="container mt-4 lg:mt-8">
        <BrandHomeHero
          eyebrow={module.eyebrow}
          heading={module.heading}
          subheading={module.subheading}
          image={module.image}
          ctaLabel={module.ctaLabel}
          ctaHref={module.ctaHref}
        />
      </div>
    )
  }

  if (module.blockType === 'collectionSpotlight') {
    const raw = module.collections?.filter((c): c is ProductCollection => typeof c === 'object') ?? []
    if (!raw.length) return null
    const collections = toTCollections(raw)
    return (
      <div className="container">
        <SectionCollectionSlider
          collections={collections}
          heading={module.heading}
          headingDim={module.subHeading ?? 'Explore by style and material'}
        />
      </div>
    )
  }

  if (module.blockType === 'productRow') {
    const raw = module.products?.filter((p): p is Product => typeof p === 'object') ?? []
    if (!raw.length) return null
    const data = toTProductItems(raw)
    return (
      <div className="container">
        <SectionSliderProductCard
          data={data}
          heading={module.heading}
          subHeading={module.subHeading ?? 'Hand-picked frames'}
          headingFontClassName="text-2xl font-semibold md:text-3xl"
          headingClassName="mb-10 text-neutral-900 dark:text-neutral-50"
        />
      </div>
    )
  }

  if (module.blockType === 'journalFeature') {
    const raw = module.posts?.filter((p): p is Post => typeof p === 'object') ?? []
    if (!raw.length) return null
    const posts = raw.map((p) => toBlogCardPost(p as unknown as CmsPost))
    return (
      <div className="container">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-semibold text-neutral-900 md:text-3xl dark:text-neutral-50">
            {module.heading}
          </h2>
          {module.subHeading ? <p className="mt-2 text-neutral-500 dark:text-neutral-400">{module.subHeading}</p> : null}
        </div>
        <SectionMagazine5 posts={posts} />
      </div>
    )
  }

  if (module.blockType === 'seasonalBanner') {
    const bg =
      module.backgroundImage && typeof module.backgroundImage === 'object' && module.backgroundImage.url
        ? module.backgroundImage.url
        : null
    const link = module.linkHref ? normalizeExternalUrl(module.linkHref) || module.linkHref : ''
    return (
      <div className="container">
        <div className="relative min-h-[12rem] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
          {bg ? (
            <Image src={bg} alt="" fill className="object-cover opacity-40 dark:opacity-30" sizes="100vw" aria-hidden />
          ) : null}
          <div className="relative flex flex-col gap-4 px-8 py-12 md:flex-row md:items-center md:justify-between md:py-14">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 md:text-3xl dark:text-neutral-50">{module.heading}</h2>
              {module.body ? <p className="mt-2 max-w-2xl text-neutral-700 dark:text-neutral-300">{module.body}</p> : null}
            </div>
            {link && module.linkLabel ? (
              <Link
                href={link}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-500"
              >
                {module.linkLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return null
}
