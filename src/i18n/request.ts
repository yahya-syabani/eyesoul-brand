import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  // Use default locale if locale is undefined (can happen during initial setup)
  const resolvedLocale = locale || routing.defaultLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(resolvedLocale as any)) {
    notFound();
  }

  const messages = (await import(`../messages/${resolvedLocale}.json`)).default;
  return { messages, locale: resolvedLocale };
});

