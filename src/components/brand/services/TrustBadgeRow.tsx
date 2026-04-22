import { FC } from 'react'

const badges = [
  { title: 'Certified Optometrists', icon: '👨‍⚕️' },
  { title: 'Premium Frame Quality', icon: '✨' },
  { title: 'State-of-the-art Equipment', icon: '🔬' },
  { title: 'Customer Satisfaction', icon: '⭐' },
]

export const TrustBadgeRow: FC = () => {
  return (
    <div className="py-8 border-y border-brand-border/50 bg-brand-surface/50 my-10 md:my-16">
      <div className="container">
        <ul className="flex flex-wrap justify-center gap-6 md:gap-12 items-center text-center">
          {badges.map((badge, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-brand-sm font-medium text-brand-ink/80">{badge.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
