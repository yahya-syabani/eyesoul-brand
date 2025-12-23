import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

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
  shippingAddress: z.record(z.any()),
  status: z.nativeEnum(OrderStatus).optional(),
})

const serializeOrder = (order: any) => ({
  ...order,
  totalAmount: Number(order.totalAmount),
  items: order.items.map((item: any) => ({
    ...item,
    price: Number(item.price),
  })),
})

export async function GET(request: Request) {
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
}

export async function POST(request: Request) {
  try {
    const payload = orderSchema.parse(await request.json())
    const totalAmount = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const created = await prisma.order.create({
      data: {
        userId: payload.userId,
        status: payload.status ?? OrderStatus.PENDING,
        totalAmount,
        shippingAddress: payload.shippingAddress,
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
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', issues: error.issues }, { status: 400 })
    }
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 })
  }
}

