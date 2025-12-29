import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const validateSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  orderAmount: z.number().min(0, 'Order amount must be positive'),
})

export async function POST(request: Request) {
  // Rate limiting
  const rateLimit = await rateLimitApi(request)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  try {
    const payload = validateSchema.parse(await request.json())

    const promotion = await prisma.promotion.findUnique({
      where: { code: payload.code },
    })

    if (!promotion) {
      return NextResponse.json(
        { error: 'Invalid promotion code', valid: false },
        { status: 404 }
      )
    }

    // Check if promotion is active
    if (!promotion.isActive) {
      return NextResponse.json(
        { error: 'Promotion code is not active', valid: false },
        { status: 400 }
      )
    }

    // Check if promotion has expired
    const now = new Date()
    if (promotion.validUntil && new Date(promotion.validUntil) < now) {
      return NextResponse.json(
        { error: 'Promotion code has expired', valid: false },
        { status: 400 }
      )
    }

    // Check if promotion has started
    if (promotion.validFrom && new Date(promotion.validFrom) > now) {
      return NextResponse.json(
        { error: 'Promotion code is not yet valid', valid: false },
        { status: 400 }
      )
    }

    // Check minimum order amount
    if (Number(promotion.minOrder) > payload.orderAmount) {
      return NextResponse.json(
        {
          error: `Minimum order amount is $${Number(promotion.minOrder).toFixed(2)}`,
          valid: false,
          minOrder: Number(promotion.minOrder),
        },
        { status: 400 }
      )
    }

    // Check usage limit
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
      return NextResponse.json(
        { error: 'Promotion code has reached its usage limit', valid: false },
        { status: 400 }
      )
    }

    // Calculate discount amount
    const discountAmount = (payload.orderAmount * promotion.discountPercent) / 100

    return NextResponse.json({
      valid: true,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        discountPercent: Number(promotion.discountPercent),
        discountAmount: Number(discountAmount.toFixed(2)),
        minOrder: Number(promotion.minOrder),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

