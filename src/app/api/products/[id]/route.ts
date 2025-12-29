import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Prisma, EyewearCategory } from '@prisma/client'
import { PRODUCT_CATEGORIES, PRODUCT_COLORS, PRODUCT_SIZES } from '@/lib/constants'
import { transformProductForFrontend } from '@/utils/transformProduct'
import { handleApiError, createNotFoundError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { ERROR_MESSAGES } from '@/lib/api-constants'
import { ProductWithRelations } from '@/lib/prisma-types'
import { stringToTranslation, TranslationObject, isValidTranslation } from '@/utils/translations'

const variationSchema = z.object({
  color: z.enum(PRODUCT_COLORS).or(z.string()),
  colorCode: z.string().optional(),
  colorImage: z.string().optional(),
  image: z.string(),
})

const frameSizeSchema = z.object({
  bridgeWidth: z.number().optional(),
  templeLength: z.number().optional(),
  lensWidth: z.number().optional(),
}).partial()

// Translation schema: accepts both String (backward compat) and JSON format
const translationSchema = z.union([
  z.string(),
  z.object({
    en: z.string(),
    id: z.string().optional(),
  }),
])

const productSchema = z.object({
  name: translationSchema.optional(),
  nameTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  slug: z.string().optional(),
  category: z.enum(PRODUCT_CATEGORIES).or(z.string()).optional(),
  type: z.string().optional(),
  description: translationSchema.optional(),
  descriptionTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  price: z.number().optional(),
  originPrice: z.number().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional(),
  thumbImages: z.array(z.string()).optional(),
  rate: z.number().optional(),
  sold: z.number().optional(),
  quantity: z.number().optional(),
  isNew: z.boolean().optional(),
  isSale: z.boolean().optional(),
  variations: z.array(variationSchema).optional(),
  lensType: z.string().optional(),
  frameMaterial: z.string().optional(),
  frameSize: frameSizeSchema.optional(),
  lensCoating: z.array(z.string()).optional(),
  sizes: z.array(z.enum(PRODUCT_SIZES).or(z.string())).optional(),
})

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variations: true, attributes: true, sizes: true },
    })

    if (!product) {
      return NextResponse.json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND }, { status: 404 })
    }

    // Get locale from Accept-Language header or default to 'en'
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en'
    const normalizedLocale = locale === 'id' ? 'id' : 'en'

    return NextResponse.json(transformProductForFrontend(product as ProductWithRelations, normalizedLocale))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Rate limiting
  const rateLimit = rateLimitApi(request)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  // Authentication check
  const authResult = await requireAdminAuth(request)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { id } = await params
    const payload = productSchema.parse(await request.json())

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      throw createNotFoundError('Product')
    }

    // Normalize name translations if provided
    const updateData: {
      name?: string
      nameTranslations?: TranslationObject
      description?: string
      descriptionTranslations?: TranslationObject
      [key: string]: unknown
    } = {}

    if (payload.name !== undefined || payload.nameTranslations !== undefined) {
      if (payload.nameTranslations) {
        // Use provided translations
        updateData.nameTranslations = payload.nameTranslations
        updateData.name = payload.nameTranslations.en
      } else if (typeof payload.name === 'string') {
        // Convert String to JSON format
        updateData.nameTranslations = stringToTranslation(payload.name)
        updateData.name = payload.name
      } else if (payload.name && typeof payload.name === 'object') {
        // JSON format provided directly
        updateData.nameTranslations = payload.name as TranslationObject
        updateData.name = updateData.nameTranslations.en
      }
      // Validate if translations provided
      if (updateData.nameTranslations && !isValidTranslation(updateData.nameTranslations)) {
        return NextResponse.json({ error: 'Invalid nameTranslations format' }, { status: 400 })
      }
    }

    // Normalize description translations if provided
    if (payload.description !== undefined || payload.descriptionTranslations !== undefined) {
      if (payload.descriptionTranslations) {
        // Use provided translations
        updateData.descriptionTranslations = payload.descriptionTranslations
        updateData.description = payload.descriptionTranslations.en
      } else if (typeof payload.description === 'string') {
        // Convert String to JSON format
        updateData.descriptionTranslations = stringToTranslation(payload.description)
        updateData.description = payload.description
      } else if (payload.description && typeof payload.description === 'object') {
        // JSON format provided directly
        updateData.descriptionTranslations = payload.description as TranslationObject
        updateData.description = updateData.descriptionTranslations.en
      }
      // Validate if translations provided
      if (updateData.descriptionTranslations && !isValidTranslation(updateData.descriptionTranslations)) {
        return NextResponse.json({ error: 'Invalid descriptionTranslations format' }, { status: 400 })
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        slug: payload.slug,
        category: payload.category ? (payload.category as EyewearCategory) : undefined,
        type: payload.type,
        price: payload.price,
        originPrice: payload.originPrice,
        brand: payload.brand,
        rate: payload.rate,
        sold: payload.sold,
        quantity: payload.quantity,
        isNew: payload.isNew,
        isSale: payload.isSale,
        images: payload.images,
        thumbImages: payload.thumbImages,
        variations: payload.variations
          ? {
              deleteMany: { productId: id },
              create: payload.variations.map((v) => ({
                color: v.color,
                colorCode: v.colorCode,
                colorImage: v.colorImage,
                image: v.image,
              })),
            }
          : undefined,
        attributes: payload.lensType || payload.frameMaterial || payload.frameSize || payload.lensCoating
          ? {
              upsert: {
                create: {
                  lensType: payload.lensType,
                  frameMaterial: payload.frameMaterial,
                  frameSize: payload.frameSize,
                  lensCoating: payload.lensCoating ?? [],
                },
                update: {
                  lensType: payload.lensType,
                  frameMaterial: payload.frameMaterial,
                  frameSize: payload.frameSize,
                  lensCoating: payload.lensCoating ?? [],
                },
              },
            }
          : undefined,
        sizes: payload.sizes
          ? {
              deleteMany: { productId: id },
              create: payload.sizes.map((size) => ({ size })),
            }
          : undefined,
      },
      include: { variations: true, attributes: true, sizes: true },
    })

    // Get locale from Accept-Language header or default to 'en'
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en'
    const normalizedLocale = locale === 'id' ? 'id' : 'en'

    return NextResponse.json(transformProductForFrontend(updated as ProductWithRelations, normalizedLocale))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  // Rate limiting
  const rateLimit = rateLimitApi(_)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  // Authentication check
  const authResult = await requireAdminAuth(_)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    return handleApiError(error)
  }
}

