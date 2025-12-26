import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { OrderStatus, Prisma } from '@prisma/client'
import { OrderWithRelations, SerializedOrderWithRelations, SerializedOrderItem } from '@/lib/prisma-types'
import { handleApiError, createNotFoundError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { ERROR_MESSAGES } from '@/lib/api-constants'

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number(),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
})

const updateSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  shippingAddress: z.record(z.string(), z.unknown()).optional(),
  items: z.array(orderItemSchema).optional(),
  userId: z.string().optional(),
})

function serializeOrder(order: OrderWithRelations): SerializedOrderWithRelations {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    shippingAddress: order.shippingAddress,
    promotionId: order.promotionId,
    discountAmount: order.discountAmount ? Number(order.discountAmount) : null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item): SerializedOrderItem => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.price),
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    })),
    user: order.user,
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    })

    if (!order) {
      return NextResponse.json({ error: ERROR_MESSAGES.ORDER_NOT_FOUND }, { status: 404 })
    }

    return NextResponse.json(serializeOrder(order))
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
    const payload = updateSchema.parse(await request.json())

    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) {
      throw createNotFoundError('Order')
    }

    // Calculate new total if items are being updated
    let totalAmount: Prisma.Decimal | number = existing.totalAmount
    if (payload.items && payload.items.length > 0) {
      totalAmount = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    const updateData: Prisma.OrderUpdateInput = {
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.shippingAddress && {
        shippingAddress: payload.shippingAddress as Prisma.InputJsonValue,
      }),
      ...(payload.userId !== undefined && { userId: payload.userId || null }),
      ...(totalAmount !== existing.totalAmount && { totalAmount }),
      ...(payload.items && {
        items: {
          deleteMany: { orderId: id },
          create: payload.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
        },
        totalAmount,
      }),
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true, user: true },
    })

    return NextResponse.json(serializeOrder(order))
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
    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) {
      throw createNotFoundError('Order')
    }

    await prisma.order.delete({ where: { id } })
    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

