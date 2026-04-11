import { BrandFooter } from './BrandFooter'
import { BrandHeader } from './BrandHeader'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/collections', label: 'Collections' },
  { href: '/stores', label: 'Stores' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function BrandShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-surface text-brand-ink">
      <a
        href="#main-content"
        className="focus:bg-brand-accent focus:text-brand-ink sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-max focus:rounded-md focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <BrandHeader nav={nav} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <BrandFooter nav={nav} />
    </div>
  )
}
