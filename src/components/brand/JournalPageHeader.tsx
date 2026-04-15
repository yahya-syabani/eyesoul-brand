type JournalPageHeaderProps = {
  title: string
  description?: string
  categoryLabel?: string
  metaLine?: string
}

export function JournalPageHeader({
  title,
  description,
  categoryLabel,
  metaLine,
}: JournalPageHeaderProps) {
  return (
    <header>
      {categoryLabel ? (
        <p className="text-sm uppercase tracking-wide text-neutral-500">{categoryLabel}</p>
      ) : null}
      <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-neutral-500">{description}</p> : null}
      {metaLine ? <p className="mt-4 text-sm text-neutral-500">{metaLine}</p> : null}
    </header>
  )
}
