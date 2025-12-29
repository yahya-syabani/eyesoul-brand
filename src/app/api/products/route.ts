import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Prisma, EyewearCategory } from '@prisma/client'
import { PRODUCT_CATEGORIES, PRODUCT_COLORS, PRODUCT_SIZES } from '@/lib/constants'
import { transformProductForFrontend } from '@/utils/transformProduct'
import { ProductWithRelations } from '@/lib/prisma-types'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
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
  name: translationSchema,
  nameTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  slug: z.string(),
  category: z.enum(PRODUCT_CATEGORIES).or(z.string()),
  type: z.string().optional(),
  description: translationSchema,
  descriptionTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  price: z.number(),
  originPrice: z.number(),
  brand: z.string().optional(),
  images: z.array(z.string()).nonempty(),
  thumbImages: z.array(z.string()).nonempty(),
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Math.min(Number(searchParams.get('limit') || 12), 100)
  const skip = (page - 1) * limit
  const category = searchParams.get('category') || undefined
  const brand = searchParams.get('brand') || undefined
  const search = searchParams.get('search') || undefined
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  const where: Prisma.ProductWhereInput = {
    ...(category ? { category: category as EyewearCategory } : {}),
    ...(brand ? { brand } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
            // Search in JSON translation fields
            { nameTranslations: { path: ['en'], string_contains: search } },
            { nameTranslations: { path: ['id'], string_contains: search } },
            { descriptionTranslations: { path: ['en'], string_contains: search } },
            { descriptionTranslations: { path: ['id'], string_contains: search } },
          ],
        }
      : {}),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice ? { gte: Number(minPrice) } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
          },
        }
      : {}),
  }

  try {
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { variations: true, attributes: true, sizes: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    // Get locale from Accept-Language header or default to 'en'
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en'
    const normalizedLocale = locale === 'id' ? 'id' : 'en'

    return NextResponse.json({
      data: items.map((item) => transformProductForFrontend(item, normalizedLocale)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  // Rate limiting
  const rateLimit = await rateLimitApi(request)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  // Authentication check
  const authResult = await requireAdminAuth(request)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const payload = productSchema.parse(await request.json())

    // Normalize name: Convert String to JSON format if needed
    let nameTranslations: TranslationObject
    let name: string
    if (payload.nameTranslations) {
      // Use provided translations
      nameTranslations = payload.nameTranslations
      name = nameTranslations.en
    } else if (typeof payload.name === 'string') {
      // Convert String to JSON format
      nameTranslations = stringToTranslation(payload.name)
      name = payload.name
    } else {
      // JSON format provided directly
      nameTranslations = payload.name as TranslationObject
      name = nameTranslations.en
    }

    // Normalize description: Convert String to JSON format if needed
    let descriptionTranslations: TranslationObject
    let description: string
    if (payload.descriptionTranslations) {
      // Use provided translations
      descriptionTranslations = payload.descriptionTranslations
      description = descriptionTranslations.en
    } else if (typeof payload.description === 'string') {
      // Convert String to JSON format
      descriptionTranslations = stringToTranslation(payload.description)
      description = payload.description
    } else {
      // JSON format provided directly
      descriptionTranslations = payload.description as TranslationObject
      description = descriptionTranslations.en
    }

    // Validate translations
    if (!isValidTranslation(nameTranslations)) {
      return NextResponse.json({ error: 'Invalid nameTranslations format' }, { status: 400 })
    }
    if (!isValidTranslation(descriptionTranslations)) {
      return NextResponse.json({ error: 'Invalid descriptionTranslations format' }, { status: 400 })
    }

    const created = await prisma.product.create({
      data: {
        name, // Keep String field for backward compatibility
        nameTranslations, // Store JSON translations
        slug: payload.slug,
        category: payload.category as EyewearCategory,
        type: payload.type,
        description, // Keep String field for backward compatibility
        descriptionTranslations, // Store JSON translations
        price: payload.price,
        originPrice: payload.originPrice,
        brand: payload.brand,
        rate: payload.rate ?? 0,
        sold: payload.sold ?? 0,
        quantity: payload.quantity ?? 0,
        isNew: payload.isNew ?? false,
        isSale: payload.isSale ?? false,
        images: payload.images,
        thumbImages: payload.thumbImages,
        variations: payload.variations
          ? {
              create: payload.variations.map((v) => ({
                color: v.color,
                colorCode: v.colorCode,
                colorImage: v.colorImage,
                image: v.image,
              })),
            }
          : undefined,
        attributes: {
          create: {
            lensType: payload.lensType,
            frameMaterial: payload.frameMaterial,
            frameSize: payload.frameSize,
            lensCoating: payload.lensCoating ?? [],
          },
        },
        sizes: payload.sizes
          ? {
              create: payload.sizes.map((size) => ({ size })),
            }
          : undefined,
      },
      include: { variations: true, attributes: true, sizes: true },
    })

    // Get locale from Accept-Language header or default to 'en'
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en'
    const normalizedLocale = locale === 'id' ? 'id' : 'en'

    return NextResponse.json(transformProductForFrontend(created, normalizedLocale), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

