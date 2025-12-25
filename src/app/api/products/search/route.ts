import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { transformProductForFrontend } from '@/utils/transformProduct'
import { handleApiError } from '@/lib/api-error-handler'
import { rateLimitSearch, createRateLimitResponse } from '@/lib/rate-limit'

export async function GET(request: Request) {
  // Rate limiting
  const rateLimit = rateLimitSearch(request)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  try {
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

    return NextResponse.json(products.map(transformProductForFrontend))
  } catch (error) {
    return handleApiError(error)
  }
}

