export function buildFaqPageJsonLd(items: { question: string; answer: string }[]): Record<string, unknown> | null {
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function collectFaqItemsFromPageBlocks(
  blocks: import('@/payload-types').Page['blocks'],
): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = []
  for (const block of blocks ?? []) {
    if (block.blockType !== 'faq' || !block.items?.length) continue
    for (const row of block.items) {
      const q = row.question?.trim()
      const a = row.answer?.trim()
      if (q && a) out.push({ question: q, answer: a })
    }
  }
  return out
}
