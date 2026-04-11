import Link from 'next/link'

import { cn } from '@/lib/cn'

type Common = {
  className?: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

type ButtonProps = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
  }

type LinkButtonProps = Common &
  Omit<React.ComponentProps<typeof Link>, 'className' | 'children'> & {
    href: string
  }

export function BrandButton(props: ButtonProps | LinkButtonProps) {
  const { variant = 'primary', className, children } = props
  const styles = cn(
    'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-brand-sm font-medium motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent',
    variant === 'primary' &&
      'bg-brand-ink text-brand-surface hover:bg-brand-ink/90 motion-safe:transition-colors',
    variant === 'secondary' &&
      'border border-brand-border bg-brand-surface text-brand-ink hover:bg-brand-muted motion-safe:transition-colors',
    variant === 'ghost' && 'text-brand-ink hover:bg-brand-muted motion-safe:transition-colors',
    className,
  )

  if ('href' in props && props.href != null) {
    const { href, ...rest } = props
    return (
      <Link href={href} className={styles} {...rest}>
        {children}
      </Link>
    )
  }

  const { type = 'button', ...rest } = props as ButtonProps
  return (
    <button type={type} className={styles} {...rest}>
      {children}
    </button>
  )
}
