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

const updateTestimonialSchema = z.object({
  name: z.string().min(1).optional(),
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
  avatar: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  star: z.number().int().min(1).max(5).optional(),
  date: z.string().min(1).optional(),
  address: z.string().optional().nullable(),
  category: z.string().min(1).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return NextResponse.json(testimonial)
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
    const payload = updateTestimonialSchema.parse(await request.json())

    // Normalize translations if provided
    const updateData: {
      title?: string
      titleTranslations?: TranslationObject
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

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...updateData,
        ...(payload.name && { name: payload.name }),
        ...(payload.avatar !== undefined && { avatar: payload.avatar }),
        ...(payload.images !== undefined && { images: payload.images }),
        ...(payload.star !== undefined && { star: payload.star }),
        ...(payload.date && { date: payload.date }),
        ...(payload.address !== undefined && { address: payload.address }),
        ...(payload.category && { category: payload.category }),
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
    await prisma.testimonial.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

