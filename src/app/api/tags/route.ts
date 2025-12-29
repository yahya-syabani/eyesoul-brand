import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

// Helper function to generate URL-friendly slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
  slug: z.string().optional(), // Optional, will be auto-generated if not provided
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name' // 'name' or 'count'

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { slug: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    // Fetch tags with blog counts
    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy:
        sortBy === 'count'
          ? {
              blogs: {
                _count: 'desc' as const,
              },
            }
          : {
              name: 'asc',
            },
    })

    // Transform to include blogCount
    const tagsWithCounts = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      blogCount: tag._count.blogs,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }))

    return NextResponse.json({
      data: tagsWithCounts,
      total: tagsWithCounts.length,
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
    const payload = tagSchema.parse(await request.json())
    
    // Generate slug from name if not provided
    const slug = payload.slug?.trim() || generateSlug(payload.name)
    
    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    })
    
    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 400 }
      )
    }

    // Check if name already exists
    const existingName = await prisma.tag.findUnique({
      where: { name: payload.name },
    })
    
    if (existingName) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' },
        { status: 400 }
      )
    }

    const created = await prisma.tag.create({
      data: {
        name: payload.name.trim(),
        slug,
      },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        id: created.id,
        name: created.name,
        slug: created.slug,
        blogCount: created._count.blogs,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

