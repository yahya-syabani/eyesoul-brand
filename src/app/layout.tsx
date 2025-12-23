import type { Metadata } from 'next'
import '@/styles/styles.scss'
import GlobalProvider from './GlobalProvider'
import SkipLink from '@/components/A11y/SkipLink'
import ClientShell from './ClientShell'
import CountdownTimeType from '@/type/CountdownType'
import { countdownTime } from '@/store/countdownTime'
import OrganizationJsonLd from '@/components/SEO/OrganizationJsonLd'
import WebSiteJsonLd from '@/components/SEO/WebSiteJsonLd'

export const metadata: Metadata = {
  title: 'Anvogue',
  description: 'Multipurpose eCommerce Template',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Keep this deterministic for server render; the client re-hydrates and drives the actual countdown.
  const serverTimeLeft: CountdownTimeType = { days: 0, hours: 0, minutes: 15, seconds: 0 }

  return (
    <GlobalProvider>
      <html lang="en">
        <body>
          <SkipLink />
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          <ClientShell serverTimeLeft={serverTimeLeft}>
            <main id="main-content">{children}</main>
          </ClientShell>
        </body>
      </html>
    </GlobalProvider>
  )
}
