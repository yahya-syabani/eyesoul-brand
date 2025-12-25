import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError, createNotFoundError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; sizeId: string }> }
) {
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
    const { id, sizeId } = await params
    const size = await prisma.productSize.findUnique({
      where: { id: sizeId },
    })

    if (!size || size.productId !== id) {
      throw createNotFoundError('Size')
    }

    await prisma.productSize.delete({ where: { id: sizeId } })
    return NextResponse.json({ message: 'Size deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

