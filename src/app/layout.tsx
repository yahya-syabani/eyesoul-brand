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
  metadataBase: new URL('https://eyesoul.brand'), // Replace with actual production URL later
  title: {
    template: '%s · Eyesoul',
    default: 'Eyesoul — Eyewear & vision care',
  },
  description:
    'Eyesoul offers crafted eyewear, eye care services, and store locations. Browse our exclusive catalog of premium glasses and find a store near you.',
  keywords: ['eyewear', 'optical', 'glasses', 'Eyesoul', 'vision care', 'frames'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eyesoul.brand',
    siteName: 'Eyesoul',
    title: 'Eyesoul — Eyewear & vision care',
    description: 'Eyesoul offers crafted eyewear, eye care services, and store locations. Browse our exclusive catalog of premium glasses.',
    images: [
      {
        url: '/og-image.png', // We can add this file later or use a static asset
        width: 1200,
        height: 630,
        alt: 'Eyesoul — Eyewear & vision care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eyesoul — Eyewear & vision care',
    description: 'Eyesoul offers crafted eyewear, eye care services, and store locations.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${eyesoulSans.variable} ${eyesoulDisplay.variable}`}>
      <body className="bg-white font-sans text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        <Aside.Provider>
          {children}

          {/* Client component: Toaster, ... */}
          <GlobalClient />

          {/* PostHog Analytics */}
          {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
            <Script
              id="posthog-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}handler=e,handler._i=[],handler.actions=[],handler.target=[],handler.tracking=[],handler.capture=function(t,e,o){handler.tracking.push([t,e,o])},handler.identify=function(t,e,o){handler.tracking.push(["identify",t,e,o])},handler.alias=function(t,e){handler.tracking.push(["alias",t,e])},handler.people=function(t,e,o){handler.tracking.push(["people",t,e,o])},handler.group=function(t,e,o){handler.tracking.push(["group",t,e,o])},handler.on=function(t,e,o){handler.tracking.push(["on",t,e,o])},handler.once=function(t,e,o){handler.tracking.push(["once",t,e,o])},handler.off=function(t,e,o){handler.tracking.push(["off",t,e,o])},handler.get_property=function(t){return null},handler.set_config=function(t){handler.config=t},handler.capture_pageview=function(t){handler.tracking.push(["capture_pageview",t])},r=["capture","identify","alias","people","group","on","once","off","set_config","capture_pageview"],r.forEach(function(t){g(handler,t)});var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=s.api_host+"/static/array.js",(p=document.getElementsByTagName("script")[0]).parentNode.insertBefore(n,p),e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
                  posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
                    api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'}',
                    capture_pageview: true 
                  })
                `,
              }}
            />
          )}
        </Aside.Provider>
      </body>
    </html>
  )
}
