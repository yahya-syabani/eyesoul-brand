'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'sunglasses',
    description: '',
    price: 0,
    originPrice: 0,
    brand: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          setForm({
            name: json.name || '',
            slug: json.slug || '',
            category: json.category || 'sunglasses',
            description: json.description || '',
            price: Number(json.price) || 0,
            originPrice: Number(json.originPrice) || 0,
            brand: json.brand || '',
          })
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          originPrice: Number(form.originPrice || form.price),
        }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.message || 'Failed to update product')
        return
      }
      router.push('/admin/products')
    } catch (err) {
      setError('Failed to update product')
    }
  }

  if (loading) {
    return <div className="container py-10 text-secondary">Loading product...</div>
  }

  if (error) {
    return <div className="container py-10 text-red">{error}</div>
  }

  return (
    <div className="container py-10">
      <h1 className="heading4 mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-title">Name</label>
            <input className="w-full border border-line rounded px-3 py-2" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-title">Slug</label>
            <input className="w-full border border-line rounded px-3 py-2" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-title">Category</label>
            <select className="w-full border border-line rounded px-3 py-2" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
              <option value="sunglasses">Sunglasses</option>
              <option value="prescription-glasses">Prescription Glasses</option>
              <option value="reading-glasses">Reading Glasses</option>
              <option value="contact-lenses">Contact Lenses</option>
              <option value="frames-only">Frames Only</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-title">Brand</label>
            <input className="w-full border border-line rounded px-3 py-2" value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-title">Price</label>
            <input type="number" className="w-full border border-line rounded px-3 py-2" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} required />
          </div>
          <div className="space-y-1">
            <label className="text-title">Origin Price</label>
            <input type="number" className="w-full border border-line rounded px-3 py-2" value={form.originPrice} onChange={(e) => handleChange('originPrice', Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-title">Description</label>
          <textarea className="w-full border border-line rounded px-3 py-2" value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} />
        </div>
        {error && <div className="text-red">{error}</div>}
        <button type="submit" className="button-main">Save Changes</button>
      </form>
    </div>
  )
}

export default EditProductPage

