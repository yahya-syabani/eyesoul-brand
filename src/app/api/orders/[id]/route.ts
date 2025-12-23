import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

const updateSchema = z.object({
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

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, user: true },
  })

  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(serializeOrder(order))
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = updateSchema.parse(await request.json())

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: payload.status,
      },
      include: { items: true, user: true },
    })

    return NextResponse.json(serializeOrder(order))
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', issues: error.issues }, { status: 400 })
    }
    return NextResponse.json({ message: 'Failed to update order' }, { status: 500 })
  }
}

