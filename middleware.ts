import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except static files and API routes
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};

