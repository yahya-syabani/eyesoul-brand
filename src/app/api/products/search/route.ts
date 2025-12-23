import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const limit = Math.min(Number(searchParams.get('limit') || 10), 50)

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: limit,
    include: { variations: true, attributes: true, sizes: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    products.map((product) => ({
      ...product,
      price: Number(product.price),
      originPrice: Number(product.originPrice),
    }))
  )
}

