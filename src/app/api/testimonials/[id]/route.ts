import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const updateTestimonialSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  avatar: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  star: z.number().int().min(1).max(5).optional(),
  date: z.string().min(1).optional(),
  address: z.string().optional().nullable(),
  category: z.string().min(1).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return NextResponse.json(testimonial)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const payload = updateTestimonialSchema.parse(await request.json())

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.title && { title: payload.title }),
        ...(payload.description && { description: payload.description }),
        ...(payload.avatar !== undefined && { avatar: payload.avatar }),
        ...(payload.images !== undefined && { images: payload.images }),
        ...(payload.star !== undefined && { star: payload.star }),
        ...(payload.date && { date: payload.date }),
        ...(payload.address !== undefined && { address: payload.address }),
        ...(payload.category && { category: payload.category }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authentication check
  const authResult = await requireAdminAuth(_)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { id } = await params
    await prisma.testimonial.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

