import { getProducts } from '@/lib/cms/products'
import { getCollections } from '@/lib/cms/productCollections'
import { toTProductItems, toTCollections } from '@/lib/cms/adapters'
import { Metadata } from 'next'
import SectionHero3 from '@/components/SectionHero/SectionHero3'
import SectionSliderProductCard from '@/components/SectionSliderProductCard'
import SectionCollectionSlider from '@/components/SectionCollectionSlider'
import SectionGridFeatureItems from '@/components/SectionGridFeatureItems'

export const metadata: Metadata = {
  title: 'Eyesoul — Clarity in every frame',
  description: 'Clarity in every frame — eyewear and vision care, crafted for daily life. Explore our catalog and find a store near you.',
}

export default async function HomePage() {
  const [collectionsRaw, productsRaw] = await Promise.all([
    getCollections({ depth: 2 }),
    getProducts({ limit: 12, depth: 2 }),
  ])

  const collections = toTCollections(collectionsRaw)
  const products = toTProductItems(productsRaw)

  // Featured products for the slider
  const featuredProducts = products.slice(0, 8)
  const newArrivals = products.slice(0, 8)

  return (
    <div className="nc-PageHome2 relative">
      <div className="container mt-4 lg:mt-8">
        <SectionHero3 />
      </div>

      <div className="relative container my-24 flex flex-col gap-y-24 lg:my-36 lg:gap-y-36">
        <SectionSliderProductCard
          data={newArrivals}
          heading="New Arrivals"
          subHeading="Discover our latest eyewear collections"
        />

        <SectionCollectionSlider
          collections={collections}
          heading="Product Collections"
          headingDim="Explore by style and material"
        />

        <SectionGridFeatureItems data={products} />
      </div>
    </div>
  )
}

