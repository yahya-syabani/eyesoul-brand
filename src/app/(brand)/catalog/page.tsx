import { getProducts } from '@/lib/cms/products'
import { toTProductItems } from '@/lib/cms/adapters'
import { Metadata } from 'next'
import HeaderFilterSection from '@/components/HeaderFilterSection'
import ProductCard from '@/components/ProductCard'
import SectionPromo1 from '@/components/SectionPromo1'

export const metadata: Metadata = {
  title: 'Catalog',
  description: 'Browse our exclusive collection of premium eyewear and designer frames.',
}

export default async function CatalogPage() {
  const productsRaw = await getProducts({ depth: 2 })
  const products = toTProductItems(productsRaw)

  return (
    <div className="nc-PageSearch relative">
      <div className={'h-24 w-full bg-primary-50 2xl:h-28 dark:bg-white/10'} />
      <div className="container">
        <header className="mx-auto -mt-10 flex max-w-2xl flex-col lg:-mt-7">
          <div className="text-center">
            <h1 className="text-3xl font-semibold md:text-4xl">Catalog</h1>
            <span className="mt-2 text-sm text-neutral-500 block">
              Discover our exclusive collection of premium eyewear.
            </span>
          </div>
        </header>
      </div>

      <div className="container flex flex-col gap-y-16 py-16 lg:gap-y-28 lg:pt-20 lg:pb-28">
        <main>
          {/* FILTER */}
          <HeaderFilterSection heading="All Eyewear" />

          {/* LOOP ITEMS */}
          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
              <ProductCard data={item} key={item.id} />
            ))}
          </div>

          {/* EMPTY STATE */}
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-semibold">No products found</h2>
              <p className="mt-2 text-neutral-500">Check back later for new arrivals.</p>
            </div>
          )}
        </main>

        <SectionPromo1 />
      </div>
    </div>
  )
}

