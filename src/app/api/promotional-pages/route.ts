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

const promotionalPageSchema = z.object({
  title: translationSchema,
  titleTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  description: translationSchema,
  descriptionTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const page = Number(searchParams.get('page') || 1)
    const limit = Math.min(Number(searchParams.get('limit') || 100), 100)
    const skip = (page - 1) * limit

    const where: { isActive?: boolean } = {}
    if (active === 'true') {
      where.isActive = true
    }

    const [pages, total] = await Promise.all([
      prisma.promotionalPage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.promotionalPage.count({ where }),
    ])

    return NextResponse.json({
      data: pages,
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
    const payload = promotionalPageSchema.parse(await request.json())

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
    if (!isValidTranslation(descriptionTranslations)) {
      return NextResponse.json({ error: 'Invalid descriptionTranslations format' }, { status: 400 })
    }

    // Auto-assign displayOrder if not provided
    let displayOrder = payload.displayOrder
    if (displayOrder === undefined) {
      const maxOrder = await prisma.promotionalPage.findFirst({
        orderBy: { displayOrder: 'desc' },
        select: { displayOrder: true },
      })
      displayOrder = (maxOrder?.displayOrder ?? -1) + 1
    }

    const created = await prisma.promotionalPage.create({
      data: {
        title, // Keep String field for backward compatibility
        titleTranslations, // Store JSON translations
        description, // Keep String field for backward compatibility
        descriptionTranslations, // Store JSON translations
        imageUrl: payload.imageUrl,
        isActive: payload.isActive ?? true,
        displayOrder,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

