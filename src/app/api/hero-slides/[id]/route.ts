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

const updateHeroSlideSchema = z.object({
  subtitle: translationSchema.optional(),
  subtitleTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  title: translationSchema.optional(),
  titleTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  imageUrl: z.string().min(1).optional(),
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const slide = await prisma.heroSlide.findUnique({
      where: { id },
    })

    if (!slide) {
      return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 })
    }

    return NextResponse.json(slide)
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
    const payload = updateHeroSlideSchema.parse(await request.json())

    // Normalize translations if provided
    const updateData: {
      subtitle?: string
      subtitleTranslations?: TranslationObject
      title?: string
      titleTranslations?: TranslationObject
      ctaText?: string | null
      ctaTextTranslations?: TranslationObject | null
      [key: string]: unknown
    } = {}

    // Normalize subtitle translations
    if (payload.subtitle !== undefined || payload.subtitleTranslations !== undefined) {
      if (payload.subtitleTranslations) {
        updateData.subtitleTranslations = payload.subtitleTranslations
        updateData.subtitle = payload.subtitleTranslations.en
      } else if (typeof payload.subtitle === 'string') {
        updateData.subtitleTranslations = stringToTranslation(payload.subtitle)
        updateData.subtitle = payload.subtitle
      } else if (payload.subtitle && typeof payload.subtitle === 'object') {
        updateData.subtitleTranslations = payload.subtitle as TranslationObject
        updateData.subtitle = updateData.subtitleTranslations.en
      }
      if (updateData.subtitleTranslations && !isValidTranslation(updateData.subtitleTranslations)) {
        return NextResponse.json({ error: 'Invalid subtitleTranslations format' }, { status: 400 })
      }
    }

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

    // Normalize ctaText translations (nullable)
    if (payload.ctaText !== undefined || payload.ctaTextTranslations !== undefined) {
      if (payload.ctaTextTranslations !== undefined) {
        if (payload.ctaTextTranslations === null) {
          updateData.ctaTextTranslations = null
          updateData.ctaText = null
        } else {
          updateData.ctaTextTranslations = payload.ctaTextTranslations
          updateData.ctaText = payload.ctaTextTranslations.en
        }
      } else if (payload.ctaText === null) {
        updateData.ctaTextTranslations = null
        updateData.ctaText = null
      } else if (typeof payload.ctaText === 'string') {
        updateData.ctaTextTranslations = stringToTranslation(payload.ctaText)
        updateData.ctaText = payload.ctaText
      } else if (payload.ctaText && typeof payload.ctaText === 'object') {
        updateData.ctaTextTranslations = payload.ctaText as TranslationObject
        updateData.ctaText = updateData.ctaTextTranslations.en
      }
      if (updateData.ctaTextTranslations && !isValidTranslation(updateData.ctaTextTranslations)) {
        return NextResponse.json({ error: 'Invalid ctaTextTranslations format' }, { status: 400 })
      }
    }

    const updated = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...updateData,
        ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
        ...(payload.ctaLink !== undefined && { ctaLink: payload.ctaLink }),
        ...(payload.isActive !== undefined && { isActive: payload.isActive }),
        ...(payload.displayOrder !== undefined && { displayOrder: payload.displayOrder }),
        ...(payload.imageWidth !== undefined && { imageWidth: payload.imageWidth }),
        ...(payload.imagePosition !== undefined && { imagePosition: payload.imagePosition }),
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
    await prisma.heroSlide.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Hero slide deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

