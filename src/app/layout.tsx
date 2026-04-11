import Aside from '@/components/aside'
import '@/styles/tailwind.css'
import { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import GlobalClient from './GlobalClient'

const eyesoulSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-eyesoul-sans',
  weight: ['400', '500', '600', '700'],
})

const eyesoulDisplay = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-eyesoul-display',
})

export const metadata: Metadata = {
  title: {
    template: '%s · Eyesoul',
    default: 'Eyesoul — Eyewear & vision care',
  },
  description:
    'Eyesoul offers crafted eyewear, eye care services, and store locations. Browse the catalog and find a store near you.',
  keywords: ['eyewear', 'optical', 'glasses', 'Eyesoul', 'vision care'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${eyesoulSans.variable} ${eyesoulDisplay.variable}`}>
      <body className="bg-white font-sans text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        <Aside.Provider>
          {children}

          {/* Client component: Toaster, ... */}
          <GlobalClient />

        </Aside.Provider>
      </body>
    </html>
  )
}
