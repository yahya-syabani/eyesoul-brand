import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { OrderStatus, Prisma } from '@prisma/client'
import { OrderWithRelations, SerializedOrderWithRelations, SerializedOrderItem } from '@/lib/prisma-types'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number(),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
})

const orderSchema = z.object({
  userId: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
  shippingAddress: z.record(z.string(), z.unknown()),
  status: z.nativeEnum(OrderStatus).optional(),
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Math.min(Number(searchParams.get('limit') || 10), 100)
    const skip = (page - 1) * limit
    const status = searchParams.get('status') as OrderStatus | null

    const where = status ? { status } : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true, user: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      data: orders.map(serializeOrder),
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
    const payload = orderSchema.parse(await request.json())
    const totalAmount = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const created = await prisma.order.create({
      data: {
        userId: payload.userId,
        status: payload.status ?? OrderStatus.PENDING,
        totalAmount,
        shippingAddress: payload.shippingAddress as unknown as Prisma.InputJsonValue,
        items: {
          create: payload.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
        },
      },
      include: { items: true, user: true },
    })

    return NextResponse.json(serializeOrder(created), { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

