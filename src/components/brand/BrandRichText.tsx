import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from 'lexical'

import type { Page, Product } from '@/payload-types'

import { cn } from '@/lib/cn'

type LexicalData = NonNullable<Product['description']> | NonNullable<
  Extract<NonNullable<Page['blocks']>[number], { blockType: 'content' }>['body']
>

export function BrandRichText({
  data,
  className,
}: {
  data: LexicalData | null | undefined
  className?: string
}) {
  if (!data?.root) return null
  return (
    <RichText
      data={data as unknown as SerializedEditorState}
      className={cn(
        'prose prose-neutral max-w-none text-brand-base text-brand-ink prose-headings:font-display prose-a:text-brand-accent-hover prose-a:underline',
        className,
      )}
    />
  )
}
