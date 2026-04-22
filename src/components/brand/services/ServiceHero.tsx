import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { FC } from 'react'

interface ServiceHeroProps {
  title: string
  subtitle: string
}

export const ServiceHero: FC<ServiceHeroProps> = ({ title, subtitle }) => {
  return (
    <section className="relative overflow-hidden bg-brand-surface py-20 lg:py-28 text-center rounded-3xl mx-4 lg:mx-auto container mt-4 md:mt-8">
      {/* Decorative premium background elements */}
      <div className="absolute inset-0 opacity-30 mix-blend-multiply bg-gradient-to-tr from-brand-muted/50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-border/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <BrandH1 className="mb-6">{title}</BrandH1>
        <BrandLead className="mx-auto max-w-2xl">{subtitle}</BrandLead>
      </div>
    </section>
  )
}
