'use client'

import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'

interface FAQ {
  question: string
  answer: string
}

interface FAQAccordionProps {
  faqs: FAQ[]
}

export const FAQAccordion: FC<FAQAccordionProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="py-12 md:py-20 bg-brand-surface/30">
      <div className="container max-w-3xl">
        <h2 className="text-3xl font-display font-semibold text-brand-ink mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Disclosure as="div" key={index} className="bg-brand-surface border border-brand-border/50 rounded-2xl overflow-hidden">
              {({ open }) => (
                <>
                  <DisclosureButton className="flex w-full justify-between items-center px-6 py-5 text-left text-brand-ink font-medium focus:outline-none focus-visible:ring focus-visible:ring-brand-accent/50">
                    <span>{faq.question}</span>
                    <ChevronDownIcon
                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-brand-muted-foreground transition-transform duration-200`}
                    />
                  </DisclosureButton>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-100 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <DisclosurePanel className="px-6 pb-5 text-brand-muted-foreground text-brand-sm">
                      {faq.answer}
                    </DisclosurePanel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  )
}
