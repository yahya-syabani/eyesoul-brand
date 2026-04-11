import Link from 'next/link'

import type { NavItem } from './BrandHeader'

export function BrandFooter({ nav }: { nav: NavItem[] }) {
  return (
    <footer className="border-t border-brand-border bg-brand-muted/40 py-12">
      <div className="container flex flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-brand-ink">Eyesoul</p>
          <p className="mt-2 max-w-sm text-sm text-brand-muted-foreground">
            Crafted eyewear and vision care. Phase 1 brand site — catalog and stores, no checkout.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-brand-muted-foreground hover:text-brand-ink motion-safe:transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container mt-10 border-t border-brand-border pt-6 text-center text-xs text-brand-muted-foreground">
        © {new Date().getFullYear()} Eyesoul. All rights reserved.
      </div>
    </footer>
  )
}
