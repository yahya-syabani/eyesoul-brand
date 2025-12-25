import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const updatePromotionSchema = z.object({
  code: z.string().min(1).optional(),
  discountPercent: z.number().int().min(1).max(100).optional(),
  minOrder: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  validFrom: z.string().datetime().optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const promotion = await prisma.promotion.findUnique({
      where: { id },
    })

    if (!promotion) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...promotion,
      discountPercent: Number(promotion.discountPercent),
      minOrder: Number(promotion.minOrder),
      validFrom: promotion.validFrom?.toISOString() || null,
      validUntil: promotion.validUntil?.toISOString() || null,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const payload = updatePromotionSchema.parse(await request.json())

    const updated = await prisma.promotion.update({
      where: { id },
      data: {
        ...(payload.code && { code: payload.code }),
        ...(payload.discountPercent !== undefined && { discountPercent: payload.discountPercent }),
        ...(payload.minOrder !== undefined && { minOrder: payload.minOrder }),
        ...(payload.isActive !== undefined && { isActive: payload.isActive }),
        ...(payload.validFrom !== undefined && {
          validFrom: payload.validFrom ? new Date(payload.validFrom) : null,
        }),
        ...(payload.validUntil !== undefined && {
          validUntil: payload.validUntil ? new Date(payload.validUntil) : null,
        }),
        ...(payload.usageLimit !== undefined && { usageLimit: payload.usageLimit ?? null }),
      },
    })

    return NextResponse.json({
      ...updated,
      discountPercent: Number(updated.discountPercent),
      minOrder: Number(updated.minOrder),
      validFrom: updated.validFrom?.toISOString() || null,
      validUntil: updated.validUntil?.toISOString() || null,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authentication check
  const authResult = await requireAdminAuth(_)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { id } = await params
    await prisma.promotion.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Promotion deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

