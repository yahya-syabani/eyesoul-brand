import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError, createNotFoundError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { ERROR_MESSAGES } from '@/lib/api-constants'
import { PRODUCT_COLORS } from '@/lib/constants'

const updateVariationSchema = z.object({
  color: z.enum(PRODUCT_COLORS).or(z.string()).optional(),
  colorCode: z.string().optional(),
  colorImage: z.string().optional(),
  image: z.string().optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; variationId: string }> }
) {
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
    const { id, variationId } = await params
    const payload = updateVariationSchema.parse(await request.json())

    const variation = await prisma.productVariation.findUnique({
      where: { id: variationId },
    })

    if (!variation || variation.productId !== id) {
      throw createNotFoundError('Variation')
    }

    const updated = await prisma.productVariation.update({
      where: { id: variationId },
      data: {
        ...(payload.color && { color: payload.color }),
        ...(payload.colorCode !== undefined && { colorCode: payload.colorCode }),
        ...(payload.colorImage !== undefined && { colorImage: payload.colorImage }),
        ...(payload.image && { image: payload.image }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; variationId: string }> }
) {
  // Rate limiting
  const rateLimit = await rateLimitApi(_)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  // Authentication check
  const authResult = await requireAdminAuth(_)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { id, variationId } = await params
    const variation = await prisma.productVariation.findUnique({
      where: { id: variationId },
    })

    if (!variation || variation.productId !== id) {
      throw createNotFoundError('Variation')
    }

    await prisma.productVariation.delete({ where: { id: variationId } })
    return NextResponse.json({ message: 'Variation deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

