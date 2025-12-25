import { ProductType } from '@/type/ProductType'
import { ProductWithRelations } from '@/lib/prisma-types'

/**
 * Transforms a product from database format to frontend ProductType format
 * Database uses: isNew, isSale, variations (array)
 * Frontend expects: new, sale, variation (array), gender, quantityPurchase
 */
export function transformProductForFrontend(product: ProductWithRelations): ProductType {
  return {
    id: product.id,
    category: product.category || '',
    type: product.type || product.category || '',
    name: product.name || '',
    gender: 'unisex', // Default gender if not in database
    new: product.isNew ?? false,
    sale: product.isSale ?? false,
    rate: product.rate ?? 0,
    price: Number(product.price) || 0,
    originPrice: Number(product.originPrice) || 0,
    brand: product.brand || '',
    sold: product.sold ?? 0,
    quantity: product.quantity ?? 0,
    quantityPurchase: 1, // Default value
    sizes: product.sizes.map((s) => s.size),
    variation: product.variations.map((v) => ({
      color: v.color || '',
      colorCode: v.colorCode || '',
      colorImage: v.colorImage || '',
      image: v.image || '',
    })),
    thumbImage: product.thumbImages || [],
    images: product.images || [],
    description: product.description || '',
    action: 'quick shop', // Default value
    slug: product.slug || '',
    lensType: product.attributes?.lensType,
    frameMaterial: product.attributes?.frameMaterial,
    frameSize: product.attributes?.frameSize as { bridgeWidth?: number; templeLength?: number; lensWidth?: number } | undefined,
    lensCoating: product.attributes?.lensCoating || [],
  }
}


