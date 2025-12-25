import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  tag: z.string().optional().nullable(),
  author: z.string().min(1, 'Author is required'),
  avatar: z.string().optional().nullable(),
  thumbImg: z.string().optional().nullable(),
  coverImg: z.string().optional().nullable(),
  subImg: z.array(z.string()).optional(),
  shortDesc: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
    const skip = (page - 1) * limit
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Prisma.BlogWhereInput = {
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { shortDesc: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blog.count({ where }),
    ])

    return NextResponse.json({
      data: blogs,
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
    const payload = blogSchema.parse(await request.json())

    const created = await prisma.blog.create({
      data: {
        title: payload.title,
        slug: payload.slug,
        category: payload.category,
        tag: payload.tag ?? null,
        author: payload.author,
        avatar: payload.avatar ?? null,
        thumbImg: payload.thumbImg ?? null,
        coverImg: payload.coverImg ?? null,
        subImg: payload.subImg ?? [],
        shortDesc: payload.shortDesc,
        description: payload.description,
        date: payload.date,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

