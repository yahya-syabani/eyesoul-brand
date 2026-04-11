import { cn } from '@/lib/cn'

export function BrandBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-brand-border bg-brand-muted/80 px-2.5 py-0.5 text-brand-xs font-medium text-brand-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
