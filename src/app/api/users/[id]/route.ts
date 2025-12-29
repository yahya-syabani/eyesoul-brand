import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'
import { handleApiError, createNotFoundError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'
import { ERROR_MESSAGES } from '@/lib/api-constants'
import { hashPassword } from '@/lib/auth'

const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.nativeEnum(Role).optional(),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  // Authentication check
  const authResult = await requireAdminAuth(_)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: ERROR_MESSAGES.NOT_FOUND }, { status: 404 })
    }

    return NextResponse.json({
      ...user,
      ordersCount: user._count.orders,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const payload = updateUserSchema.parse(await request.json())

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      throw createNotFoundError('User')
    }

    // Check email uniqueness if email is being updated
    if (payload.email && payload.email !== existing.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: payload.email },
      })
      if (emailExists) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: {
      email?: string
      password?: string
      role?: Role
    } = {}

    if (payload.email) updateData.email = payload.email
    if (payload.role) updateData.role = payload.role
    if (payload.password) {
      updateData.password = await hashPassword(payload.password)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  // Rate limiting
  const rateLimit = await rateLimitApi(_)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  // Authentication check
  const authResult = await requireAdminAuth(_)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { id } = await params
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      throw createNotFoundError('User')
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

