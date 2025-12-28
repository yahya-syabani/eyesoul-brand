import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'id'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always prefix URLs with locale (this is the default behavior)
  localePrefix: 'always',

  // The `pathnames` object holds pairs of internal and
  // external pathnames. Based on the locale, the
  // external pathnames are rewritten to the shared,
  // internal format.
  pathnames: {
    // If all locales use the same pathname, a single
    // string can be provided instead of an object
    '/': '/',
    '/shop': '/shop',
    '/blog': '/blog',
    '/product': '/product',
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/login': '/login',
    '/register': '/register',
    '/my-account': '/my-account',
    '/wishlist': '/wishlist',
    '/search-result': '/search-result',
    '/compare': '/compare',
    '/forgot-password': '/forgot-password',
    '/pages/about': '/pages/about',
    '/pages/contact': '/pages/contact',
    '/pages/faqs': '/pages/faqs',
    '/pages/store-location': '/pages/store-location',
    '/pages/service': '/pages/service',
    '/pages/insurance': '/pages/insurance'
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

