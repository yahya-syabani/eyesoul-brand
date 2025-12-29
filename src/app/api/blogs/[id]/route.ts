import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
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

const updateBlogSchema = z.object({
  title: translationSchema.optional(),
  titleTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  slug: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tag: z.string().optional().nullable(), // @deprecated - use tags instead
  tags: z.array(z.string()).optional(), // Array of tag slugs
  author: z.string().min(1).optional(),
  avatar: z.string().optional().nullable(),
  thumbImg: z.string().optional().nullable(),
  coverImg: z.string().optional().nullable(),
  subImg: z.array(z.string()).optional(),
  shortDesc: translationSchema.optional(),
  shortDescTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  description: translationSchema.optional(),
  descriptionTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  date: z.string().min(1).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const bySlug = searchParams.get('slug') === 'true'

    const blog = bySlug
      ? await prisma.blog.findUnique({
          where: { slug: id },
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
      : await prisma.blog.findUnique({
          where: { id },
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

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Transform to include tags in convenient format
    const blogWithTags = {
      ...blog,
      tags: blog.tags.map((bt) => bt.tag),
    }

    return NextResponse.json(blogWithTags)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params
    const payload = updateBlogSchema.parse(await request.json())

    // Handle tags update if provided
    let tagsUpdate: any = undefined
    if (payload.tags !== undefined) {
      if (payload.tags.length > 0) {
        // Find tags by slug
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

        // Delete existing BlogTag relationships and create new ones
        tagsUpdate = {
          deleteMany: {},
          create: tags.map((tag) => ({ tagId: tag.id })),
        }
      } else {
        // Remove all tags
        tagsUpdate = {
          deleteMany: {},
        }
      }
    }

    // Normalize translations if provided
    const updateData: {
      title?: string
      titleTranslations?: TranslationObject
      shortDesc?: string
      shortDescTranslations?: TranslationObject
      description?: string
      descriptionTranslations?: TranslationObject
      [key: string]: unknown
    } = {}

    // Normalize title translations
    if (payload.title !== undefined || payload.titleTranslations !== undefined) {
      if (payload.titleTranslations) {
        updateData.titleTranslations = payload.titleTranslations
        updateData.title = payload.titleTranslations.en
      } else if (typeof payload.title === 'string') {
        updateData.titleTranslations = stringToTranslation(payload.title)
        updateData.title = payload.title
      } else if (payload.title && typeof payload.title === 'object') {
        updateData.titleTranslations = payload.title as TranslationObject
        updateData.title = updateData.titleTranslations.en
      }
      if (updateData.titleTranslations && !isValidTranslation(updateData.titleTranslations)) {
        return NextResponse.json({ error: 'Invalid titleTranslations format' }, { status: 400 })
      }
    }

    // Normalize shortDesc translations
    if (payload.shortDesc !== undefined || payload.shortDescTranslations !== undefined) {
      if (payload.shortDescTranslations) {
        updateData.shortDescTranslations = payload.shortDescTranslations
        updateData.shortDesc = payload.shortDescTranslations.en
      } else if (typeof payload.shortDesc === 'string') {
        updateData.shortDescTranslations = stringToTranslation(payload.shortDesc)
        updateData.shortDesc = payload.shortDesc
      } else if (payload.shortDesc && typeof payload.shortDesc === 'object') {
        updateData.shortDescTranslations = payload.shortDesc as TranslationObject
        updateData.shortDesc = updateData.shortDescTranslations.en
      }
      if (updateData.shortDescTranslations && !isValidTranslation(updateData.shortDescTranslations)) {
        return NextResponse.json({ error: 'Invalid shortDescTranslations format' }, { status: 400 })
      }
    }

    // Normalize description translations
    if (payload.description !== undefined || payload.descriptionTranslations !== undefined) {
      if (payload.descriptionTranslations) {
        updateData.descriptionTranslations = payload.descriptionTranslations
        updateData.description = payload.descriptionTranslations.en
      } else if (typeof payload.description === 'string') {
        updateData.descriptionTranslations = stringToTranslation(payload.description)
        updateData.description = payload.description
      } else if (payload.description && typeof payload.description === 'object') {
        updateData.descriptionTranslations = payload.description as TranslationObject
        updateData.description = updateData.descriptionTranslations.en
      }
      if (updateData.descriptionTranslations && !isValidTranslation(updateData.descriptionTranslations)) {
        return NextResponse.json({ error: 'Invalid descriptionTranslations format' }, { status: 400 })
      }
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        ...updateData,
        ...(payload.slug && { slug: payload.slug }),
        ...(payload.category && { category: payload.category }),
        ...(payload.tag !== undefined && { tag: payload.tag }),
        ...(payload.author && { author: payload.author }),
        ...(payload.avatar !== undefined && { avatar: payload.avatar }),
        ...(payload.thumbImg !== undefined && { thumbImg: payload.thumbImg }),
        ...(payload.coverImg !== undefined && { coverImg: payload.coverImg }),
        ...(payload.subImg !== undefined && { subImg: payload.subImg }),
        ...(payload.date && { date: payload.date }),
        ...(tagsUpdate && { tags: tagsUpdate }),
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
      ...updated,
      tags: updated.tags.map((bt) => bt.tag),
    }

    return NextResponse.json(blogWithTags)
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
    await prisma.blog.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

