import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
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

const heroSlideSchema = z.object({
  subtitle: translationSchema,
  subtitleTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  title: translationSchema,
  titleTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  ctaText: translationSchema.optional().nullable(),
  ctaTextTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  imageWidth: z.string().optional().nullable(),
  imagePosition: z.string().optional().nullable(),
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

    const [slides, total] = await Promise.all([
      prisma.heroSlide.findMany({
        where,
        skip,
        take: limit,
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.heroSlide.count({ where }),
    ])

    return NextResponse.json({
      data: slides,
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
    const payload = heroSlideSchema.parse(await request.json())

    // Normalize subtitle translations
    let subtitleTranslations: TranslationObject
    let subtitle: string
    if (payload.subtitleTranslations) {
      subtitleTranslations = payload.subtitleTranslations
      subtitle = subtitleTranslations.en
    } else if (typeof payload.subtitle === 'string') {
      subtitleTranslations = stringToTranslation(payload.subtitle)
      subtitle = payload.subtitle
    } else {
      subtitleTranslations = payload.subtitle as TranslationObject
      subtitle = subtitleTranslations.en
    }

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

    // Normalize ctaText translations (nullable)
    let ctaTextTranslations: TranslationObject | null = null
    let ctaText: string | null = null
    if (payload.ctaTextTranslations !== undefined) {
      if (payload.ctaTextTranslations === null) {
        ctaTextTranslations = null
        ctaText = null
      } else {
        ctaTextTranslations = payload.ctaTextTranslations
        ctaText = ctaTextTranslations.en
      }
    } else if (payload.ctaText !== undefined) {
      if (payload.ctaText === null) {
        ctaTextTranslations = null
        ctaText = null
      } else if (typeof payload.ctaText === 'string') {
        ctaTextTranslations = stringToTranslation(payload.ctaText)
        ctaText = payload.ctaText
      } else {
        ctaTextTranslations = payload.ctaText as TranslationObject
        ctaText = ctaTextTranslations.en
      }
    } else {
      // Default value
      ctaTextTranslations = stringToTranslation('Shop Now')
      ctaText = 'Shop Now'
    }

    // Validate translations
    if (!isValidTranslation(subtitleTranslations)) {
      return NextResponse.json({ error: 'Invalid subtitleTranslations format' }, { status: 400 })
    }
    if (!isValidTranslation(titleTranslations)) {
      return NextResponse.json({ error: 'Invalid titleTranslations format' }, { status: 400 })
    }
    if (ctaTextTranslations && !isValidTranslation(ctaTextTranslations)) {
      return NextResponse.json({ error: 'Invalid ctaTextTranslations format' }, { status: 400 })
    }

    // Auto-assign displayOrder if not provided
    let displayOrder = payload.displayOrder
    if (displayOrder === undefined) {
      const maxOrder = await prisma.heroSlide.findFirst({
        orderBy: { displayOrder: 'desc' },
        select: { displayOrder: true },
      })
      displayOrder = (maxOrder?.displayOrder ?? -1) + 1
    }

    const created = await prisma.heroSlide.create({
      data: {
        subtitle, // Keep String field for backward compatibility
        subtitleTranslations: subtitleTranslations as Prisma.InputJsonValue, // Store JSON translations
        title, // Keep String field for backward compatibility
        titleTranslations: titleTranslations as Prisma.InputJsonValue, // Store JSON translations
        imageUrl: payload.imageUrl,
        ctaText, // Keep String field for backward compatibility
        ctaTextTranslations: ctaTextTranslations === null 
          ? Prisma.JsonNull 
          : (ctaTextTranslations as Prisma.InputJsonValue), // Store JSON translations
        ctaLink: payload.ctaLink ?? '/shop/breadcrumb-img',
        isActive: payload.isActive ?? true,
        displayOrder,
        imageWidth: payload.imageWidth ?? null,
        imagePosition: payload.imagePosition ?? null,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

