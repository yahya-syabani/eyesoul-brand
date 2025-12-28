import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect locale-prefixed admin routes to non-locale admin routes
  // e.g., /id/admin/login -> /admin/login
  // e.g., /en/admin/dashboard -> /admin/dashboard
  const localeAdminMatch = pathname.match(/^\/(en|id)\/admin(\/.*)?$/);
  if (localeAdminMatch) {
    const adminPath = localeAdminMatch[2] || '';
    return NextResponse.redirect(new URL(`/admin${adminPath}`, request.url));
  }
  
  // Use next-intl middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except static files and API routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

