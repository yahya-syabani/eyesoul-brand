import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Prisma, Role } from '@prisma/client'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { ERROR_MESSAGES } from '@/lib/api-constants'
import { hashPassword } from '@/lib/auth'

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(Role).default(Role.CUSTOMER),
})

export async function GET(request: Request) {
  // Authentication check
  const authResult = await requireAdminAuth(request)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
    const skip = (page - 1) * limit
    const role = searchParams.get('role') as Role | null
    const search = searchParams.get('search') || undefined

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(search
        ? {
            email: { contains: search, mode: Prisma.QueryMode.insensitive },
          }
        : {}),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { orders: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      data: users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        ordersCount: user._count.orders,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
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
    const payload = createUserSchema.parse(await request.json())

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(payload.password)

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: payload.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

