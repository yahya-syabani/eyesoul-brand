'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const NewProductPage = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('sunglasses')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [originPrice, setOriginPrice] = useState(0)
  const [brand, setBrand] = useState('eyesoul')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          category,
          description,
          price: Number(price),
          originPrice: Number(originPrice || price),
          brand,
          images: ['/images/product/1000x1000.png'],
          thumbImages: ['/images/product/1000x1000.png'],
          variations: [],
          sizes: ['medium'],
          lensType: 'single-vision',
          frameMaterial: 'acetate',
          lensCoating: [],
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.message || 'Failed to create product')
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
    <div className="container py-10">
      <h1 className="heading4 mb-6">New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-title">Name</label>
            <input className="w-full border border-line rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-title">Slug</label>
            <input className="w-full border border-line rounded px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-title">Category</label>
            <select className="w-full border border-line rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="sunglasses">Sunglasses</option>
              <option value="prescription-glasses">Prescription Glasses</option>
              <option value="reading-glasses">Reading Glasses</option>
              <option value="contact-lenses">Contact Lenses</option>
              <option value="frames-only">Frames Only</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-title">Brand</label>
            <input className="w-full border border-line rounded px-3 py-2" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-title">Price</label>
            <input type="number" className="w-full border border-line rounded px-3 py-2" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
          </div>
          <div className="space-y-1">
            <label className="text-title">Origin Price</label>
            <input type="number" className="w-full border border-line rounded px-3 py-2" value={originPrice} onChange={(e) => setOriginPrice(Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-title">Description</label>
          <textarea className="w-full border border-line rounded px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>
        {error && <div className="text-red">{error}</div>}
        <button type="submit" className="button-main" disabled={loading}>
          {loading ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

export default NewProductPage

