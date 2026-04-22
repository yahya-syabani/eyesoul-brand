import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'


interface ServiceCardProps {
  title: string
  description?: string
  iconUrl?: string | null
  slug: string
  isBenefit?: boolean
}

export const ServiceCard: FC<ServiceCardProps> = ({ title, description, iconUrl, slug, isBenefit }) => {
  const CardContent = (
    <>
      {iconUrl && (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-muted/50 mb-6 group-hover:scale-105 transition-transform duration-500">
          <Image src={iconUrl} alt={title} fill className="object-cover p-3" sizes="64px" />
        </div>
      )}
      <h3 className={`font-display font-semibold text-brand-ink mb-3 ${isBenefit ? 'text-xl' : 'text-2xl'}`}>
        {title}
      </h3>
      {description && <p className="text-brand-sm text-brand-muted-foreground mb-6 line-clamp-3">{description}</p>}
      
      <div className="mt-auto">
        <div className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-brand-sm font-medium border border-brand-border bg-brand-surface text-brand-ink w-full group-hover:bg-brand-ink group-hover:text-white transition-colors duration-300">
          Learn More
        </div>
      </div>
    </>
  )

  return (
    <Link
      href={`/services/${slug}`}
      className={`group flex flex-col rounded-3xl border border-brand-border/50 bg-brand-surface p-6 md:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 block h-full`}
    >
      {CardContent}
    </Link>
  )
}
