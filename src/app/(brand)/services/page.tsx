import { resolveBrandImage } from '@/components/brand/brandMedia'
import { getServices } from '@/lib/cms/services'

import { ServiceCard } from '@/components/brand/services/ServiceCard'
import { ServiceHero } from '@/components/brand/services/ServiceHero'
import { TrustBadgeRow } from '@/components/brand/services/TrustBadgeRow'

export default async function ServicesPage() {
  const services = await getServices({ depth: 2 })

  // Safely fallback to 'core_service' if the category field isn't populated yet
  const coreServices = services.filter((s) => !s.category || s.category === 'core_service')
  const premiumBenefits = services.filter((s) => s.category === 'premium_benefit')

  return (
    <div className="pb-20">
      <ServiceHero 
        title="Premium Services & Care" 
        subtitle="Experience professional vision care and exclusive benefits designed around your lifestyle and visual needs." 
      />
      
      <TrustBadgeRow />

      <section className="container mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-brand-ink mb-4">Core Services</h2>
          <p className="text-brand-muted-foreground text-brand-sm max-w-2xl mx-auto">
            Comprehensive eye care solutions delivered by certified professionals using state-of-the-art technology.
          </p>
        </div>
        
        {coreServices.length === 0 ? (
          <p className="text-center text-brand-muted-foreground">No core services available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {coreServices.map((s) => {
              const icon = resolveBrandImage(s.icon, 'card')
              return (
                <ServiceCard
                  key={s.id}
                  title={s.name}
                  description={s.description || undefined}
                  iconUrl={icon?.src}
                  slug={s.slug || ''}
                />
              )
            })}
          </div>
        )}
      </section>

      <section className="container bg-brand-surface/30 rounded-3xl py-16 md:py-24 px-6 md:px-12 border border-brand-border/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-brand-ink mb-4">Eyesoul Privileges</h2>
          <p className="text-brand-muted-foreground text-brand-sm max-w-2xl mx-auto">
            Enjoy exclusive benefits and peace of mind with our premium customer programs.
          </p>
        </div>

        {premiumBenefits.length === 0 ? (
          <p className="text-center text-brand-muted-foreground">Premium benefits coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumBenefits.map((s) => {
              const icon = resolveBrandImage(s.icon, 'card')
              return (
                <ServiceCard
                  key={s.id}
                  title={s.name}
                  description={s.description || undefined}
                  iconUrl={icon?.src}
                  slug={s.slug || ''}
                  isBenefit
                />
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
