import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const storeLocationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  hoursWeekdays: z.string().min(1, 'Weekdays hours are required'),
  hoursSaturday: z.string().min(1, 'Saturday hours are required'),
  hoursSunday: z.string().min(1, 'Sunday hours are required'),
  mapUrl: z.string().url('Map URL must be a valid URL'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.number().int().optional().default(0),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where = includeInactive ? {} : { isActive: true }

    const locations = await prisma.storeLocation.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    })

    // Transform to include hours object and coordinates as numbers for frontend compatibility
    const transformedLocations = locations.map((location) => {
      const { hoursWeekdays, hoursSaturday, hoursSunday, latitude, longitude, ...rest } = location
      return {
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
    })

    return NextResponse.json({
      data: transformedLocations,
      total: transformedLocations.length,
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
    const payload = storeLocationSchema.parse(await request.json())

    const created = await prisma.storeLocation.create({
      data: {
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
        email: payload.email ?? null,
        imageUrl: payload.imageUrl ?? null,
        hoursWeekdays: payload.hoursWeekdays,
        hoursSaturday: payload.hoursSaturday,
        hoursSunday: payload.hoursSunday,
        mapUrl: payload.mapUrl,
        latitude: payload.latitude,
        longitude: payload.longitude,
        isActive: payload.isActive ?? true,
        displayOrder: payload.displayOrder ?? 0,
      },
    })

    // Transform response to match frontend format
    const { hoursWeekdays, hoursSaturday, hoursSunday, latitude, longitude, ...rest } = created
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

    return NextResponse.json(transformed, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

