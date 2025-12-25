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
  name: z.string().optional(),
  slug: z.string().optional(),
  category: z.enum(PRODUCT_CATEGORIES).or(z.string()).optional(),
  type: z.string().optional(),
  description: z.string().optional(),
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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variations: true, attributes: true, sizes: true },
    })

    if (!product) {
      return NextResponse.json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND }, { status: 404 })
    }

    return NextResponse.json(transformProductForFrontend(product as ProductWithRelations))
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

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: payload.name,
        slug: payload.slug,
        category: payload.category ? (payload.category as EyewearCategory) : undefined,
        type: payload.type,
        description: payload.description,
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

    return NextResponse.json(transformProductForFrontend(updated as ProductWithRelations))
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

