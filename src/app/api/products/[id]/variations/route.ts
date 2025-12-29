import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError, createNotFoundError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { ERROR_MESSAGES } from '@/lib/api-constants'
import { PRODUCT_COLORS } from '@/lib/constants'

const variationSchema = z.object({
  color: z.enum(PRODUCT_COLORS).or(z.string()),
  colorCode: z.string().optional(),
  colorImage: z.string().optional(),
  image: z.string(),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND }, { status: 404 })
    }

    const variations = await prisma.productVariation.findMany({
      where: { productId: id },
      orderBy: { color: 'asc' },
    })

    return NextResponse.json({ data: variations })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params
    const payload = variationSchema.parse(await request.json())

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw createNotFoundError('Product')
    }

    const variation = await prisma.productVariation.create({
      data: {
        productId: id,
        color: payload.color,
        colorCode: payload.colorCode,
        colorImage: payload.colorImage,
        image: payload.image,
      },
    })

    return NextResponse.json(variation, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

