import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const promotionSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  discountPercent: z.number().int().min(1).max(100),
  minOrder: z.number().min(0),
  isActive: z.boolean().optional(),
  validFrom: z.string().datetime().optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
    const skip = (page - 1) * limit
    const isActive = searchParams.get('isActive')
    const expired = searchParams.get('expired') === 'true'

    const where: Prisma.PromotionWhereInput = {
      ...(isActive !== null ? { isActive: isActive === 'true' } : {}),
      ...(expired
        ? {
            validUntil: {
              lt: new Date(),
            },
          }
        : {}),
    }

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.promotion.count({ where }),
    ])

    return NextResponse.json({
      data: promotions.map((p) => ({
        ...p,
        discountPercent: Number(p.discountPercent),
        minOrder: Number(p.minOrder),
        validFrom: p.validFrom?.toISOString() || null,
        validUntil: p.validUntil?.toISOString() || null,
      })),
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
    const payload = promotionSchema.parse(await request.json())

    const created = await prisma.promotion.create({
      data: {
        code: payload.code,
        discountPercent: payload.discountPercent,
        minOrder: payload.minOrder,
        isActive: payload.isActive ?? true,
        validFrom: payload.validFrom ? new Date(payload.validFrom) : null,
        validUntil: payload.validUntil ? new Date(payload.validUntil) : null,
        usageLimit: payload.usageLimit ?? null,
      },
    })

    return NextResponse.json(
      {
        ...created,
        discountPercent: Number(created.discountPercent),
        minOrder: Number(created.minOrder),
        validFrom: created.validFrom?.toISOString() || null,
        validUntil: created.validUntil?.toISOString() || null,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

