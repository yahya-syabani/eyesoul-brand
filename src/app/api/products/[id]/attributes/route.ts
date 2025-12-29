import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError, createNotFoundError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { ERROR_MESSAGES } from '@/lib/api-constants'

const frameSizeSchema = z.object({
  bridgeWidth: z.number().optional(),
  templeLength: z.number().optional(),
  lensWidth: z.number().optional(),
}).partial()

const attributesSchema = z.object({
  lensType: z.string().optional(),
  frameMaterial: z.string().optional(),
  frameSize: frameSizeSchema.optional(),
  lensCoating: z.array(z.string()).optional(),
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

    const attributes = await prisma.productAttribute.findUnique({
      where: { productId: id },
    })

    return NextResponse.json(attributes || null)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const payload = attributesSchema.parse(await request.json())

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw createNotFoundError('Product')
    }

    const attributes = await prisma.productAttribute.upsert({
      where: { productId: id },
      create: {
        productId: id,
        lensType: payload.lensType,
        frameMaterial: payload.frameMaterial,
        frameSize: payload.frameSize,
        lensCoating: payload.lensCoating ?? [],
      },
      update: {
        ...(payload.lensType !== undefined && { lensType: payload.lensType }),
        ...(payload.frameMaterial !== undefined && { frameMaterial: payload.frameMaterial }),
        ...(payload.frameSize !== undefined && { frameSize: payload.frameSize }),
        ...(payload.lensCoating !== undefined && { lensCoating: payload.lensCoating }),
      },
    })

    return NextResponse.json(attributes)
  } catch (error) {
    return handleApiError(error)
  }
}

