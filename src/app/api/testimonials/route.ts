import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  avatar: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  star: z.number().int().min(1).max(5),
  date: z.string().min(1, 'Date is required'),
  address: z.string().optional().nullable(),
  category: z.string().min(1, 'Category is required'),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
    const skip = (page - 1) * limit
    const category = searchParams.get('category')
    const star = searchParams.get('star')

    const where: Prisma.TestimonialWhereInput = {
      ...(category ? { category } : {}),
      ...(star ? { star: Number(star) } : {}),
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.testimonial.count({ where }),
    ])

    return NextResponse.json({
      data: testimonials,
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
    const payload = testimonialSchema.parse(await request.json())

    const created = await prisma.testimonial.create({
      data: {
        name: payload.name,
        title: payload.title,
        description: payload.description,
        avatar: payload.avatar ?? null,
        images: payload.images ?? [],
        star: payload.star,
        date: payload.date,
        address: payload.address ?? null,
        category: payload.category,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

