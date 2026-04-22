import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { FC } from 'react'

interface BenefitCalloutsProps {
  callouts: string[]
}

/**
 * Visual checklist used on premium benefit pages.
 * Renders a 2-column grid of check-icon + text pairs.
 */
export const ServiceBenefitCallouts: FC<BenefitCalloutsProps> = ({ callouts }) => {
  if (!callouts || callouts.length === 0) return null

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {callouts.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 bg-brand-surface rounded-2xl border border-brand-border/50 p-5"
        >
          <CheckCircleIcon className="h-6 w-6 shrink-0 text-brand-ink mt-0.5" />
          <span className="text-brand-base text-brand-ink font-medium">{item}</span>
        </li>
      ))}
    </ul>
  )
}
