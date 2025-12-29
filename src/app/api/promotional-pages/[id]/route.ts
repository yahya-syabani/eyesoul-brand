import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { stringToTranslation, TranslationObject, isValidTranslation } from '@/utils/translations'
import { ERROR_MESSAGES } from '@/lib/api-constants'

// Translation schema: accepts both String (backward compat) and JSON format
const translationSchema = z.union([
  z.string(),
  z.object({
    en: z.string(),
    id: z.string().optional(),
  }),
])

const promotionalPageSchema = z.object({
  title: translationSchema.optional(),
  titleTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  description: translationSchema.optional(),
  descriptionTranslations: z.object({
    en: z.string(),
    id: z.string().optional(),
  }).optional(),
  imageUrl: z.string().min(1, 'Image URL is required').optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const page = await prisma.promotionalPage.findUnique({
      where: { id },
    })

    if (!page) {
      return NextResponse.json({ error: ERROR_MESSAGES.NOT_FOUND }, { status: 404 })
    }

    return NextResponse.json(page)
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
    const existing = await prisma.promotionalPage.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: ERROR_MESSAGES.NOT_FOUND }, { status: 404 })
    }

    const payload = promotionalPageSchema.parse(await request.json())

    // Build update data object
    const updateData: any = {}

    // Handle title translations if provided
    if (payload.titleTranslations !== undefined || payload.title !== undefined) {
      let titleTranslations: TranslationObject
      let title: string

      if (payload.titleTranslations) {
        titleTranslations = payload.titleTranslations
        title = titleTranslations.en
      } else if (payload.title !== undefined) {
        if (typeof payload.title === 'string') {
          titleTranslations = stringToTranslation(payload.title)
          title = payload.title
        } else {
          titleTranslations = payload.title as TranslationObject
          title = titleTranslations.en
        }
      } else {
        // Use existing values if not provided
        titleTranslations = existing.titleTranslations as TranslationObject || stringToTranslation(existing.title)
        title = existing.title
      }

      if (isValidTranslation(titleTranslations)) {
        updateData.title = title
        updateData.titleTranslations = titleTranslations
      }
    }

    // Handle description translations if provided
    if (payload.descriptionTranslations !== undefined || payload.description !== undefined) {
      let descriptionTranslations: TranslationObject
      let description: string

      if (payload.descriptionTranslations) {
        descriptionTranslations = payload.descriptionTranslations
        description = descriptionTranslations.en
      } else if (payload.description !== undefined) {
        if (typeof payload.description === 'string') {
          descriptionTranslations = stringToTranslation(payload.description)
          description = payload.description
        } else {
          descriptionTranslations = payload.description as TranslationObject
          description = descriptionTranslations.en
        }
      } else {
        // Use existing values if not provided
        descriptionTranslations = existing.descriptionTranslations as TranslationObject || stringToTranslation(existing.description)
        description = existing.description
      }

      if (isValidTranslation(descriptionTranslations)) {
        updateData.description = description
        updateData.descriptionTranslations = descriptionTranslations
      }
    }

    // Handle other fields
    if (payload.imageUrl !== undefined) {
      updateData.imageUrl = payload.imageUrl
    }
    if (payload.isActive !== undefined) {
      updateData.isActive = payload.isActive
    }
    if (payload.displayOrder !== undefined) {
      updateData.displayOrder = payload.displayOrder
    }

    const updated = await prisma.promotionalPage.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
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
    const existing = await prisma.promotionalPage.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: ERROR_MESSAGES.NOT_FOUND }, { status: 404 })
    }

    await prisma.promotionalPage.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Promotional page deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

