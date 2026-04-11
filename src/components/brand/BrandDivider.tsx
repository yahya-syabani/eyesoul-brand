import { cn } from '@/lib/cn'

export function BrandDivider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-brand-border', className)} role="presentation" />
}
