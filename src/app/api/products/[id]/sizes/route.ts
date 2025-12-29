import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError, createNotFoundError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { ERROR_MESSAGES } from '@/lib/api-constants'
import { PRODUCT_SIZES } from '@/lib/constants'

const sizeSchema = z.object({
  size: z.enum(PRODUCT_SIZES).or(z.string()),
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

    const sizes = await prisma.productSize.findMany({
      where: { productId: id },
      orderBy: { size: 'asc' },
    })

    return NextResponse.json({ data: sizes })
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
    const payload = sizeSchema.parse(await request.json())

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw createNotFoundError('Product')
    }

    // Check if size already exists
    const existing = await prisma.productSize.findFirst({
      where: { productId: id, size: payload.size },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Size already exists for this product' },
        { status: 400 }
      )
    }

    const size = await prisma.productSize.create({
      data: {
        productId: id,
        size: payload.size,
      },
    })

    return NextResponse.json(size, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

