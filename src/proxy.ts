import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { authCookieName } from '@/lib/auth'

// Create i18n middleware
const intlMiddleware = createMiddleware(routing)

export const config = {
  // Match all routes except static files, API routes, and admin routes
  matcher: ['/', '/(id|en)/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin authentication (admin routes don't use i18n)
  if (pathname.startsWith('/admin')) {
    // Allow login page
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next()
    }

    const token = request.cookies.get(authCookieName)?.value
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Admin routes don't need i18n middleware
    return NextResponse.next()
  }

  // For all other routes, use i18n middleware
  return intlMiddleware(request)
}

