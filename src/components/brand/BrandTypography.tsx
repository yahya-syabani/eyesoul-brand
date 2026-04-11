import { cn } from '@/lib/cn'

export function BrandH1({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h1 className={cn('font-display text-brand-4xl font-semibold tracking-tight text-brand-ink', className)}>
      {children}
    </h1>
  )
}

export function BrandH2({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h2 className={cn('font-display text-brand-3xl font-semibold tracking-tight text-brand-ink', className)}>
      {children}
    </h2>
  )
}

export function BrandH3({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('font-display text-brand-2xl font-semibold tracking-tight text-brand-ink', className)}>
      {children}
    </h3>
  )
}

export function BrandLead({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn('text-brand-lg text-brand-muted-foreground max-w-2xl', className)}>{children}</p>
  )
}

export function BrandBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('text-brand-base text-brand-ink', className)}>{children}</p>
}
