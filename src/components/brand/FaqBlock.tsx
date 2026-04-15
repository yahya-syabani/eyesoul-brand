type Item = { id?: string | null; question: string; answer: string }

export function FaqBlock({
  heading,
  items,
}: {
  heading?: string | null
  items?: Item[] | null
}) {
  const list = items?.filter((i) => i.question?.trim() && i.answer?.trim()) ?? []
  if (!list.length) return null

  return (
    <section className="container max-w-3xl" aria-labelledby={heading ? 'faq-heading' : undefined}>
      {heading ? (
        <h2 id="faq-heading" className="font-display text-2xl font-semibold text-brand-ink">
          {heading}
        </h2>
      ) : null}
      <div className={heading ? 'mt-8' : ''}>
        {list.map((item) => (
          <details
            key={item.id ?? item.question}
            className="group border-b border-brand-border py-4 first:pt-0 last:border-b-0"
          >
            <summary className="cursor-pointer list-none font-medium text-brand-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-brand-muted-foreground transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-brand-sm leading-relaxed text-brand-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
