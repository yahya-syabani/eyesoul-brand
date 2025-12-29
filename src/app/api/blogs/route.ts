import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { stringToTranslation, TranslationObject, isValidTranslation } from '@/utils/translations'

// Translation schema: accepts both String (backward compat) and JSON format
const translationSchema = z.union([
  z.string(),
  z.object({
    en: z.string(),
    id: z.string().optional(),
  }),
])

const blogSchema = z.object({
  title: translationSchema,
  titleTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  tag: z.string().optional().nullable(), // @deprecated - use tags instead
  tags: z.array(z.string()).optional(), // Array of tag slugs
  author: z.string().min(1, 'Author is required'),
  avatar: z.string().optional().nullable(),
  thumbImg: z.string().optional().nullable(),
  coverImg: z.string().optional().nullable(),
  subImg: z.array(z.string()).optional(),
  shortDesc: translationSchema,
  shortDescTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  description: translationSchema,
  descriptionTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  date: z.string().min(1, 'Date is required'),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
    const skip = (page - 1) * limit
    const category = searchParams.get('category')
    const tag = searchParams.get('tag') // Filter by tag slug
    const search = searchParams.get('search')

    const where: Prisma.BlogWhereInput = {
      ...(category ? { category } : {}),
      ...(tag
        ? {
            tags: {
              some: {
                tag: {
                  slug: tag,
                },
              },
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { shortDesc: { contains: search, mode: Prisma.QueryMode.insensitive } },
              // Search in JSON translation fields
              { titleTranslations: { path: ['en'], string_contains: search } },
              { titleTranslations: { path: ['id'], string_contains: search } },
              { shortDescTranslations: { path: ['en'], string_contains: search } },
              { shortDescTranslations: { path: ['id'], string_contains: search } },
              { descriptionTranslations: { path: ['en'], string_contains: search } },
              { descriptionTranslations: { path: ['id'], string_contains: search } },
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
        include: {
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      prisma.blog.count({ where }),
    ])

    // Transform blogs to include tags in a more convenient format
    const blogsWithTags = blogs.map((blog) => ({
      ...blog,
      tags: blog.tags.map((bt) => bt.tag),
    }))

    return NextResponse.json({
      data: blogsWithTags,
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
    const payload = blogSchema.parse(await request.json())

    // Normalize title translations
    let titleTranslations: TranslationObject
    let title: string
    if (payload.titleTranslations) {
      titleTranslations = payload.titleTranslations
      title = titleTranslations.en
    } else if (typeof payload.title === 'string') {
      titleTranslations = stringToTranslation(payload.title)
      title = payload.title
    } else {
      titleTranslations = payload.title as TranslationObject
      title = titleTranslations.en
    }

    // Normalize shortDesc translations
    let shortDescTranslations: TranslationObject
    let shortDesc: string
    if (payload.shortDescTranslations) {
      shortDescTranslations = payload.shortDescTranslations
      shortDesc = shortDescTranslations.en
    } else if (typeof payload.shortDesc === 'string') {
      shortDescTranslations = stringToTranslation(payload.shortDesc)
      shortDesc = payload.shortDesc
    } else {
      shortDescTranslations = payload.shortDesc as TranslationObject
      shortDesc = shortDescTranslations.en
    }

    // Normalize description translations
    let descriptionTranslations: TranslationObject
    let description: string
    if (payload.descriptionTranslations) {
      descriptionTranslations = payload.descriptionTranslations
      description = descriptionTranslations.en
    } else if (typeof payload.description === 'string') {
      descriptionTranslations = stringToTranslation(payload.description)
      description = payload.description
    } else {
      descriptionTranslations = payload.description as TranslationObject
      description = descriptionTranslations.en
    }

    // Validate translations
    if (!isValidTranslation(titleTranslations)) {
      return NextResponse.json({ error: 'Invalid titleTranslations format' }, { status: 400 })
    }
    if (!isValidTranslation(shortDescTranslations)) {
      return NextResponse.json({ error: 'Invalid shortDescTranslations format' }, { status: 400 })
    }
    if (!isValidTranslation(descriptionTranslations)) {
      return NextResponse.json({ error: 'Invalid descriptionTranslations format' }, { status: 400 })
    }

    // Handle tags: find tags by slug and create BlogTag relationships
    let tagIds: string[] = []
    if (payload.tags && payload.tags.length > 0) {
      const tags = await prisma.tag.findMany({
        where: {
          slug: {
            in: payload.tags,
          },
        },
      })

      if (tags.length !== payload.tags.length) {
        const foundSlugs = tags.map((t) => t.slug)
        const missingSlugs = payload.tags.filter((slug) => !foundSlugs.includes(slug))
        return NextResponse.json(
          { error: `Tags not found: ${missingSlugs.join(', ')}` },
          { status: 400 }
        )
      }

      tagIds = tags.map((tag) => tag.id)
    }

    const created = await prisma.blog.create({
      data: {
        title, // Keep String field for backward compatibility
        titleTranslations, // Store JSON translations
        slug: payload.slug,
        category: payload.category,
        tag: payload.tag ?? null, // Keep for backward compatibility
        author: payload.author,
        avatar: payload.avatar ?? null,
        thumbImg: payload.thumbImg ?? null,
        coverImg: payload.coverImg ?? null,
        subImg: payload.subImg ?? [],
        shortDesc, // Keep String field for backward compatibility
        shortDescTranslations, // Store JSON translations
        description, // Keep String field for backward compatibility
        descriptionTranslations, // Store JSON translations
        date: payload.date,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    // Transform to include tags in convenient format
    const blogWithTags = {
      ...created,
      tags: created.tags.map((bt) => bt.tag),
    }

    return NextResponse.json(blogWithTags, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

