import { FC } from 'react'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'

export const ContactHero: FC = () => {
  return (
    <section className="container mt-6 mb-12">
      <div className="relative overflow-hidden rounded-3xl bg-brand-surface border border-brand-border/30 px-8 py-16 md:px-16 md:py-24 lg:py-32 text-center">
        {/* subtle decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-muted/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-brand-border/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <BrandH1 className="mb-6 text-balance">We're here to help</BrandH1>
          <BrandLead className="mx-auto text-brand-muted-foreground">
            Whether you have a question about our collections, need help with an order, or want to book an appointment, our team is ready to assist you.
          </BrandLead>
        </div>
      </div>
    </section>
  )
}
