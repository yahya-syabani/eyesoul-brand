'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { cn } from '@/lib/cn'

import { BrandLogoLink } from './BrandLogo'

export type NavItem = { href: string; label: string }

export function BrandHeader({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-surface/95 backdrop-blur-md motion-safe:transition-colors">
      <div className="container flex h-16 items-center justify-between gap-4">
        <BrandLogoLink />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium motion-safe:transition-colors',
                pathname === item.href
                  ? 'bg-brand-muted text-brand-ink'
                  : 'text-brand-muted-foreground hover:bg-brand-muted/80 hover:text-brand-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-brand-border p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden className="flex flex-col gap-1">
            <span className={cn('block h-0.5 w-5 bg-brand-ink motion-safe:transition', open && 'translate-y-1.5 rotate-45')} />
            <span className={cn('block h-0.5 w-5 bg-brand-ink motion-safe:transition', open && 'opacity-0')} />
            <span className={cn('block h-0.5 w-5 bg-brand-ink motion-safe:transition', open && '-translate-y-1.5 -rotate-45')} />
          </span>
        </button>
      </div>
      <div
        id="mobile-nav"
        className={cn('border-t border-brand-border md:hidden', !open && 'hidden')}
        hidden={!open}
      >
        <nav className="container flex flex-col py-3" aria-label="Mobile primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-brand-ink hover:bg-brand-muted"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
