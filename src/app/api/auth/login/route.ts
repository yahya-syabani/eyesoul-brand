import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authCookieName, signToken, verifyPassword } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { rateLimitLogin, createRateLimitResponse } from '@/lib/rate-limit'
import { COOKIE_MAX_AGE, ERROR_MESSAGES } from '@/lib/api-constants'
import { handleApiError } from '@/lib/api-error-handler'

export async function POST(request: Request) {
  // Rate limiting
  const rateLimit = await rateLimitLogin(request)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS }, { status: 401 })
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email })

    const response = NextResponse.json({ message: 'Logged in', user: { id: user.id, email: user.email, role: user.role } })
    response.cookies.set(authCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    })
    return response
  } catch (error) {
    return handleApiError(error)
  }
}

