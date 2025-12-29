import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const updateStoreLocationSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  hoursWeekdays: z.string().min(1).optional(),
  hoursSaturday: z.string().min(1).optional(),
  hoursSunday: z.string().min(1).optional(),
  mapUrl: z.string().url().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const location = await prisma.storeLocation.findUnique({
      where: { id },
    })

    if (!location) {
      return NextResponse.json({ error: 'Store location not found' }, { status: 404 })
    }

    // Transform to include hours object and coordinates as numbers
    const { hoursWeekdays, hoursSaturday, hoursSunday, latitude, longitude, ...rest } = location
    const transformed = {
      ...rest,
      hours: {
        weekdays: hoursWeekdays,
        saturday: hoursSaturday,
        sunday: hoursSunday,
      },
      coordinates: {
        lat: Number(latitude),
        lng: Number(longitude),
      },
    }

    return NextResponse.json(transformed)
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
    const payload = updateStoreLocationSchema.parse(await request.json())

    const updated = await prisma.storeLocation.update({
      where: { id },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.address && { address: payload.address }),
        ...(payload.province && { province: payload.province }),
        ...(payload.phone && { phone: payload.phone }),
        ...(payload.email !== undefined && { email: payload.email }),
        ...(payload.imageUrl !== undefined && { imageUrl: payload.imageUrl }),
        ...(payload.hoursWeekdays && { hoursWeekdays: payload.hoursWeekdays }),
        ...(payload.hoursSaturday && { hoursSaturday: payload.hoursSaturday }),
        ...(payload.hoursSunday && { hoursSunday: payload.hoursSunday }),
        ...(payload.mapUrl && { mapUrl: payload.mapUrl }),
        ...(payload.latitude !== undefined && { latitude: payload.latitude }),
        ...(payload.longitude !== undefined && { longitude: payload.longitude }),
        ...(payload.isActive !== undefined && { isActive: payload.isActive }),
        ...(payload.displayOrder !== undefined && { displayOrder: payload.displayOrder }),
      },
    })

    // Transform response to match frontend format
    const { hoursWeekdays, hoursSaturday, hoursSunday, latitude, longitude, ...rest } = updated
    const transformed = {
      ...rest,
      hours: {
        weekdays: hoursWeekdays,
        saturday: hoursSaturday,
        sunday: hoursSunday,
      },
      coordinates: {
        lat: Number(latitude),
        lng: Number(longitude),
      },
    }

    return NextResponse.json(transformed)
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
    await prisma.storeLocation.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Store location deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

