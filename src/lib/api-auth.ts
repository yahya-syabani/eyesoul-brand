import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { authCookieName, verifyToken, type AuthTokenPayload } from './auth'
import { ERROR_MESSAGES } from './api-constants'

export interface AuthResult {
  user: AuthTokenPayload
  error?: never
  status?: never
}

export interface AuthError {
  user?: never
  error: NextResponse
  status: number
}

export type AuthCheckResult = AuthResult | AuthError

/**
 * Verifies API authentication by checking JWT token from cookies
 * Returns user payload if authenticated, or error response if not
 */
export async function verifyApiAuth(request: Request): Promise<AuthCheckResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get(authCookieName)?.value

  if (!token) {
    return {
      error: NextResponse.json({ error: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 }),
      status: 401,
    }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return {
      error: NextResponse.json({ error: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 }),
      status: 401,
    }
  }

  if (payload.role !== 'ADMIN') {
    return {
      error: NextResponse.json({ error: ERROR_MESSAGES.FORBIDDEN }, { status: 403 }),
      status: 403,
    }
  }

  return { user: payload }
}

/**
 * Middleware helper to protect API routes that require admin authentication
 * Usage: const authResult = await requireAdminAuth(request)
 *        if ('error' in authResult) return authResult.error
 */
export async function requireAdminAuth(request: Request): Promise<AuthCheckResult> {
  return verifyApiAuth(request)
}

