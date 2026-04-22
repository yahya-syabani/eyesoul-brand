import { FC } from 'react'

interface ProcessStep {
  title: string
  description: string
}

interface ProcessStepsProps {
  steps: ProcessStep[]
}

export const ProcessSteps: FC<ProcessStepsProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null

  return (
    <section className="py-12 md:py-20">
      <div className="container max-w-4xl">
        <h2 className="text-3xl font-display font-semibold text-brand-ink mb-12 text-center">How It Works</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-border before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-brand-surface bg-brand-ink text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                {index + 1}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-brand-surface border border-brand-border/50 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <h3 className="font-display font-semibold text-brand-ink text-xl mb-2">{step.title}</h3>
                <p className="text-brand-sm text-brand-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
