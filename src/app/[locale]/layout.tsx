import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import GlobalProvider from '../GlobalProvider'
import SkipLink from '@/components/A11y/SkipLink'
import ClientShell from '../ClientShell'
import CountdownTimeType from '@/type/CountdownType'
import OrganizationJsonLd from '@/components/SEO/OrganizationJsonLd'
import WebSiteJsonLd from '@/components/SEO/WebSiteJsonLd'

export const metadata: Metadata = {
  title: 'Eyesoul Eyewear',
  description: 'Multipurpose eCommerce Template',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })

  // Keep this deterministic for server render; the client re-hydrates and drives the actual countdown.
  const serverTimeLeft: CountdownTimeType = { days: 0, hours: 0, minutes: 15, seconds: 0 }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <GlobalProvider>
            <SkipLink />
            <OrganizationJsonLd />
            <WebSiteJsonLd />
            <ClientShell serverTimeLeft={serverTimeLeft}>
              <main id="main-content">{children}</main>
            </ClientShell>
          </GlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

