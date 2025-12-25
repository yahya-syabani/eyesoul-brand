'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput, AdminTextarea, AdminSelect } from '@/components/Admin/AdminFormField'
import { PRODUCT_CATEGORIES, BRANDS, LENS_TYPES, FRAME_MATERIALS, LENS_COATINGS, PRODUCT_SIZES, PRODUCT_COLORS, COLOR_CODES } from '@/lib/constants'
import * as Icon from '@phosphor-icons/react/dist/ssr'

interface Variation {
  color: string
  colorCode?: string
  colorImage?: string
  image: string
}

const NewProductPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'sunglasses',
    type: '',
    description: '',
    price: 0,
    originPrice: 0,
    brand: 'eyesoul',
    quantity: 0,
    rate: 0,
    sold: 0,
    isNew: false,
    isSale: false,
    images: [''],
    thumbImages: [''],
  })
  const [variations, setVariations] = useState<Variation[]>([])
  const [attributes, setAttributes] = useState({
    lensType: '',
    frameMaterial: '',
    frameSize: { lensWidth: undefined, bridgeWidth: undefined, templeLength: undefined },
    lensCoating: [] as string[],
  })
  const [sizes, setSizes] = useState<string[]>(['medium'])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const addVariation = () => {
    setVariations([...variations, { color: '', image: '' }])
  }

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index))
  }

  const updateVariation = (index: number, field: keyof Variation, value: string) => {
    const updated = [...variations]
    updated[index] = { ...updated[index], [field]: value }
    setVariations(updated)
  }

  const addSize = () => {
    setSizes([...sizes, 'medium'])
  }

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index))
  }

  const updateSize = (index: number, value: string) => {
    const updated = [...sizes]
    updated[index] = value
    setSizes(updated)
  }

  const toggleCoating = (coating: string) => {
    setAttributes({
      ...attributes,
      lensCoating: attributes.lensCoating.includes(coating)
        ? attributes.lensCoating.filter((c) => c !== coating)
        : [...attributes.lensCoating, coating],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        category: form.category,
        type: form.type || undefined,
        description: form.description,
        price: Number(form.price),
        originPrice: Number(form.originPrice || form.price),
        brand: form.brand || undefined,
        quantity: Number(form.quantity) || 0,
        rate: Number(form.rate) || 0,
        sold: Number(form.sold) || 0,
        isNew: form.isNew,
        isSale: form.isSale,
        images: form.images.filter((img) => img.trim()),
        thumbImages: form.thumbImages.filter((img) => img.trim()),
        variations: variations.filter((v) => v.color && v.image),
        sizes: sizes.filter((s) => s.trim()),
        lensType: attributes.lensType || undefined,
        frameMaterial: attributes.frameMaterial || undefined,
        frameSize: Object.values(attributes.frameSize).some((v) => v) ? attributes.frameSize : undefined,
        lensCoating: attributes.lensCoating,
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || json.message || 'Failed to create product')
        return
      }
      router.push('/admin/products')
    } catch (err) {
      setError('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="border border-line rounded-lg p-6 space-y-4">
          <h2 className="heading6 mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <AdminInput
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <AdminInput
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <AdminSelect
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                { value: 'sunglasses', label: 'Sunglasses' },
                { value: 'prescription_glasses', label: 'Prescription Glasses' },
                { value: 'reading_glasses', label: 'Reading Glasses' },
                { value: 'contact_lenses', label: 'Contact Lenses' },
                { value: 'frames_only', label: 'Frames Only' },
              ]}
              required
            />
            <AdminInput
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <AdminInput
              label="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <div className="space-y-1">
              <label className="text-title">Rating</label>
              <input
                type="number"
                min="0"
                max="5"
                className="w-full border border-line rounded px-3 py-2"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })}
              />
            </div>
          </div>
          <AdminTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            required
          />
        </div>

        {/* Pricing & Inventory */}
        <div className="border border-line rounded-lg p-6 space-y-4">
          <h2 className="heading6 mb-4">Pricing & Inventory</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <AdminInput
              label="Price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
            <AdminInput
              label="Original Price"
              type="number"
              step="0.01"
              value={form.originPrice}
              onChange={(e) => setForm({ ...form, originPrice: Number(e.target.value) })}
            />
            <AdminInput
              label="Stock Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <AdminInput
              label="Sold"
              type="number"
              value={form.sold}
              onChange={(e) => setForm({ ...form, sold: Number(e.target.value) })}
            />
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isNew}
                  onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                />
                <span className="text-title">New Product</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isSale}
                  onChange={(e) => setForm({ ...form, isSale: e.target.checked })}
                />
                <span className="text-title">On Sale</span>
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="border border-line rounded-lg p-6 space-y-4">
          <h2 className="heading6 mb-4">Images</h2>
          <AdminInput
            label="Main Image URL"
            value={form.images[0] || ''}
            onChange={(e) => setForm({ ...form, images: [e.target.value] })}
            placeholder="/images/product/1000x1000.png"
          />
          <AdminInput
            label="Thumbnail Image URL"
            value={form.thumbImages[0] || ''}
            onChange={(e) => setForm({ ...form, thumbImages: [e.target.value] })}
            placeholder="/images/product/1000x1000.png"
          />
        </div>

        {/* Variations */}
        <div className="border border-line rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="heading6">Variations</h2>
            <button
              type="button"
              onClick={addVariation}
              className="px-3 py-1 border border-line rounded text-sm hover:bg-surface"
            >
              Add Variation
            </button>
          </div>
          {variations.map((variation, index) => (
            <div key={index} className="border border-line rounded p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-title">Variation {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeVariation(index)}
                  className="text-red hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-title text-sm mb-1 block">Color</label>
                  <select
                    className="w-full border border-line rounded px-3 py-2"
                    value={variation.color}
                    onChange={(e) => updateVariation(index, 'color', e.target.value)}
                  >
                    <option value="">Select color</option>
                    {PRODUCT_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-title text-sm mb-1 block">Color Code</label>
                  <input
                    type="text"
                    className="w-full border border-line rounded px-3 py-2"
                    value={variation.colorCode || ''}
                    onChange={(e) => updateVariation(index, 'colorCode', e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="text-title text-sm mb-1 block">Image URL</label>
                <input
                  type="text"
                  className="w-full border border-line rounded px-3 py-2"
                  value={variation.image}
                  onChange={(e) => updateVariation(index, 'image', e.target.value)}
                  placeholder="/images/product/1000x1000.png"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Attributes */}
        <div className="border border-line rounded-lg p-6 space-y-4">
          <h2 className="heading6 mb-4">Attributes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <AdminSelect
              label="Lens Type"
              value={attributes.lensType}
              onChange={(e) => setAttributes({ ...attributes, lensType: e.target.value })}
              options={[{ value: '', label: 'Select...' }, ...LENS_TYPES.map((type) => ({ value: type, label: type.replace(/-/g, ' ') }))]}
            />
            <AdminSelect
              label="Frame Material"
              value={attributes.frameMaterial}
              onChange={(e) => setAttributes({ ...attributes, frameMaterial: e.target.value })}
              options={[{ value: '', label: 'Select...' }, ...FRAME_MATERIALS.map((mat) => ({ value: mat, label: mat }))]}
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-title mb-1 block">Lens Width</label>
              <input
                type="number"
                className="w-full border border-line rounded px-3 py-2"
                value={attributes.frameSize.lensWidth || ''}
                onChange={(e) =>
                  setAttributes({
                    ...attributes,
                    frameSize: { ...attributes.frameSize, lensWidth: e.target.value ? Number(e.target.value) : undefined },
                  })
                }
              />
            </div>
            <div>
              <label className="text-title mb-1 block">Bridge Width</label>
              <input
                type="number"
                className="w-full border border-line rounded px-3 py-2"
                value={attributes.frameSize.bridgeWidth || ''}
                onChange={(e) =>
                  setAttributes({
                    ...attributes,
                    frameSize: { ...attributes.frameSize, bridgeWidth: e.target.value ? Number(e.target.value) : undefined },
                  })
                }
              />
            </div>
            <div>
              <label className="text-title mb-1 block">Temple Length</label>
              <input
                type="number"
                className="w-full border border-line rounded px-3 py-2"
                value={attributes.frameSize.templeLength || ''}
                onChange={(e) =>
                  setAttributes({
                    ...attributes,
                    frameSize: { ...attributes.frameSize, templeLength: e.target.value ? Number(e.target.value) : undefined },
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-title mb-2 block">Lens Coating</label>
            <div className="flex flex-wrap gap-2">
              {LENS_COATINGS.map((coating) => (
                <label key={coating} className="flex items-center gap-2 px-3 py-2 border border-line rounded cursor-pointer hover:bg-surface">
                  <input
                    type="checkbox"
                    checked={attributes.lensCoating.includes(coating)}
                    onChange={() => toggleCoating(coating)}
                  />
                  <span className="text-sm">{coating.replace(/-/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="border border-line rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="heading6">Sizes</h2>
            <button
              type="button"
              onClick={addSize}
              className="px-3 py-1 border border-line rounded text-sm hover:bg-surface"
            >
              Add Size
            </button>
          </div>
          {sizes.map((size, index) => (
            <div key={index} className="flex items-center gap-3">
              <select
                className="flex-1 border border-line rounded px-3 py-2"
                value={size}
                onChange={(e) => updateSize(index, e.target.value)}
              >
                {PRODUCT_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>
              {size === 'custom' && (
                <input
                  type="text"
                  className="flex-1 border border-line rounded px-3 py-2"
                  placeholder="Enter custom size"
                  value={size}
                  onChange={(e) => updateSize(index, e.target.value)}
                />
              )}
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="text-red hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {error && <div className="text-red">{error}</div>}
        <div className="flex gap-3">
          <button type="submit" className="button-main" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-line rounded-lg hover:bg-surface"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewProductPage
