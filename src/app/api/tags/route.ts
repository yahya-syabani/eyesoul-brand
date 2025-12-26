import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'

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

