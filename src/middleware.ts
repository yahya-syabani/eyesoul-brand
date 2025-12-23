import { NextRequest, NextResponse } from 'next/server'
import { authCookieName } from '@/lib/auth'

export const config = {
  matcher: ['/admin/:path*'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  return NextResponse.next()
}

