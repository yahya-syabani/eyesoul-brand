import type { Product } from '@/payload-types'

import Image from 'next/image'

import { BrandButton } from './BrandButton'
import { resolveBrandImage } from './brandMedia'

const LENS_LABEL: Record<string, string> = {
  'single-vision': 'Single vision',
  progressive: 'Progressive',
  photochromic: 'Photochromic',
  polarized: 'Polarized',
  other: 'Other',
}

const MATERIAL_LABEL: Record<string, string> = {
  cr39: 'CR-39',
  polycarbonate: 'Polycarbonate',
  'high-index': 'High index',
  other: 'Other',
}

const TREATMENT_LABEL: Record<string, string> = {
  'anti-reflective': 'Anti-reflective',
  'blue-light': 'Blue light',
  uv: 'UV',
  'scratch-resistant': 'Scratch resistant',
  none: 'None',
}

const FRAME_LABEL: Record<string, string> = {
  acetate: 'Acetate',
  metal: 'Metal',
  titanium: 'Titanium',
  mixed: 'Mixed',
  other: 'Other',
}

function hasSpecContent(specs: NonNullable<Product['specs']>): boolean {
  return !!(
    specs.bridgeMm != null ||
    specs.templeMm != null ||
    specs.lensWidthMm != null ||
    specs.lensHeightMm != null ||
    specs.lensType ||
    specs.lensMaterial ||
    specs.lensTreatment ||
    specs.frameMaterial ||
    (specs.fitNotes && specs.fitNotes.trim()) ||
    (specs.faceShapeHints && specs.faceShapeHints.trim()) ||
    specs.dimensionDiagram
  )
}

export function ProductSpecs({ product }: { product: Product }) {
  const specs = product.specs
  const show = specs?.showSpecsOnPdp !== false

  if (!show || !specs || !hasSpecContent(specs)) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 dark:border-neutral-700 dark:bg-neutral-900/30">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Fit &amp; lens details</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Specifications are not listed for this frame yet. Our team can help you choose in store.
        </p>
        <BrandButton href="/stores" variant="secondary" className="mt-4">
          Ask in store
        </BrandButton>
      </section>
    )
  }

  const rows: Array<{ label: string; value: string }> = []
  if (specs.bridgeMm != null) rows.push({ label: 'Bridge', value: `${specs.bridgeMm} mm` })
  if (specs.templeMm != null) rows.push({ label: 'Temple', value: `${specs.templeMm} mm` })
  if (specs.lensWidthMm != null) rows.push({ label: 'Lens width', value: `${specs.lensWidthMm} mm` })
  if (specs.lensHeightMm != null) rows.push({ label: 'Lens height', value: `${specs.lensHeightMm} mm` })
  if (specs.lensType) rows.push({ label: 'Lens type', value: LENS_LABEL[specs.lensType] ?? specs.lensType })
  if (specs.lensMaterial) rows.push({ label: 'Lens material', value: MATERIAL_LABEL[specs.lensMaterial] ?? specs.lensMaterial })
  if (specs.lensTreatment) rows.push({ label: 'Lens treatment', value: TREATMENT_LABEL[specs.lensTreatment] ?? specs.lensTreatment })
  if (specs.frameMaterial) rows.push({ label: 'Frame material', value: FRAME_LABEL[specs.frameMaterial] ?? specs.frameMaterial })
  if (specs.faceShapeHints?.trim()) rows.push({ label: 'Face shape hints', value: specs.faceShapeHints.trim() })

  const diagram = resolveBrandImage(specs.dimensionDiagram, 'card')

  return (
    <section className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700" aria-labelledby="product-specs-heading">
      <h2 id="product-specs-heading" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Fit &amp; lens details
      </h2>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Measurements are in millimeters (mm).</p>

      {diagram ? (
        <div className="relative mt-4 aspect-[4/3] max-w-md overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
          <Image src={diagram.src} alt={diagram.alt || 'Frame dimension diagram'} fill className="object-contain" sizes="(min-width: 1024px) 400px, 100vw" />
        </div>
      ) : null}

      {rows.length > 0 ? (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{row.label}</dt>
              <dd className="text-sm text-neutral-900 dark:text-neutral-100">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {specs.fitNotes?.trim() ? (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Fit notes</h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{specs.fitNotes.trim()}</p>
        </div>
      ) : null}
    </section>
  )
}
