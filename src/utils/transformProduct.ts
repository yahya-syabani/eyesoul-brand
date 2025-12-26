import { ProductType } from '@/type/ProductType'
import { ProductWithRelations } from '@/lib/prisma-types'
import { getTranslatedText, TranslationObject } from './translations'

/**
 * Transforms a product from database format to frontend ProductType format
 * Database uses: isNew, isSale, variations (array)
 * Frontend expects: new, sale, variation (array), gender, quantityPurchase
 * 
 * Handles both old String format (backward compatibility) and new JSON translation format
 */
export function transformProductForFrontend(
  product: ProductWithRelations,
  locale: string = 'en'
): ProductType {
  // Handle name translation: prefer nameTranslations (JSON), fallback to name (String)
  const name = product.nameTranslations
    ? getTranslatedText(product.nameTranslations as TranslationObject, locale)
    : (product.name || '')

  // Handle description translation: prefer descriptionTranslations (JSON), fallback to description (String)
  const description = product.descriptionTranslations
    ? getTranslatedText(product.descriptionTranslations as TranslationObject, locale)
    : (product.description || '')

  return {
    id: product.id,
    category: product.category || '',
    type: product.type || product.category || '',
    name,
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
    description,
    action: 'quick shop', // Default value
    slug: product.slug || '',
    lensType: product.attributes?.lensType,
    frameMaterial: product.attributes?.frameMaterial,
    frameSize: product.attributes?.frameSize as { bridgeWidth?: number; templeLength?: number; lensWidth?: number } | undefined,
    lensCoating: product.attributes?.lensCoating || [],
  }
}


