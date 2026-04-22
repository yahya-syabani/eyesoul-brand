import { FC } from 'react'

interface ServiceHighlight {
  label: string
  icon: string
}

interface ServiceHighlightsProps {
  highlights: ServiceHighlight[]
  heading?: string
}

/**
 * 2×N icon grid used on core service pages to show capability highlights
 * (e.g. "Digital Refraction Testing", "Intraocular Pressure Check").
 * Icons are plain emoji — swap for SVG icons when brand icons are available.
 */
export const ServiceHighlights: FC<ServiceHighlightsProps> = ({
  highlights,
  heading = 'What we check',
}) => {
  if (!highlights || highlights.length === 0) return null

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-2xl font-display font-semibold text-brand-ink mb-8 text-center">
          {heading}
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <li
              key={i}
              className="flex flex-col items-center text-center gap-3 bg-brand-surface border border-brand-border/50 rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="text-3xl" aria-hidden="true">
                {h.icon}
              </span>
              <span className="text-brand-sm font-medium text-brand-ink">{h.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
