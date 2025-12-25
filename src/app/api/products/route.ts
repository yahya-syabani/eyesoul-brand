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

const productSchema = z.object({
  name: z.string(),
  slug: z.string(),
  category: z.enum(PRODUCT_CATEGORIES).or(z.string()),
  type: z.string().optional(),
  description: z.string(),
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

    return NextResponse.json({
      data: items.map(transformProductForFrontend),
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
    const payload = productSchema.parse(await request.json())

    const created = await prisma.product.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        category: payload.category as EyewearCategory,
        type: payload.type,
        description: payload.description,
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

    return NextResponse.json(transformProductForFrontend(created), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

