import { FC, ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface ContactMethodCardProps {
  title: string
  description: string
  icon: ReactNode
  actionLabel: string
  href: string
  isPrimary?: boolean
  onClick?: () => void
}

export const ContactMethodCard: FC<ContactMethodCardProps> = ({
  title,
  description,
  icon,
  actionLabel,
  href,
  isPrimary,
  onClick,
}) => {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
  
  const content = (
    <>
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${isPrimary ? 'bg-brand-ink text-brand-surface' : 'bg-brand-muted/50 text-brand-ink'} transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="font-display text-brand-xl font-semibold text-brand-ink mb-2">
        {title}
      </h3>
      <p className="text-brand-sm text-brand-muted-foreground mb-6 flex-grow">
        {description}
      </p>
      <div className={`mt-auto inline-flex items-center text-brand-sm font-medium ${isPrimary ? 'text-brand-ink' : 'text-brand-accent-hover'}`}>
        {actionLabel}
        <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </>
  )

  const className = `group flex flex-col rounded-2xl border ${isPrimary ? 'border-brand-ink/20 shadow-sm' : 'border-brand-border/50'} bg-brand-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full`

  if (isExternal) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {content}
    </Link>
  )
}
