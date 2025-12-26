'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { AdminInput } from '@/components/Admin/AdminFormField'

interface HeroSlide {
  id: string
  subtitle: string
  title: string
  imageUrl: string
  ctaText: string | null
  ctaLink: string | null
  isActive: boolean
  displayOrder: number
  imageWidth: string | null
  imagePosition: string | null
}

const EditHeroSlidePage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<HeroSlide | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    loadSlide()
  }, [id])

  const loadSlide = async () => {
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setForm(data)
      } else {
        setError('Hero slide not found')
      }
    } catch (error) {
      console.error('Error loading hero slide:', error)
      setError('Failed to load hero slide')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    setError(null)
    setLoading(true)

    try {
      const payload = {
        subtitle: form.subtitle,
        title: form.title,
        imageUrl: form.imageUrl,
        ctaText: form.ctaText || null,
        ctaLink: form.ctaLink || null,
        isActive: form.isActive,
        displayOrder: form.displayOrder,
        imageWidth: form.imageWidth || null,
        imagePosition: form.imagePosition || null,
      }

      const res = await fetch(`/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/hero-slides')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to update hero slide')
      }
    } catch (error) {
      console.error('Error updating hero slide:', error)
      setError('Failed to update hero slide')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-secondary">Loading...</div>
  }

  if (!form) {
    return <div className="text-red">Hero slide not found</div>
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">Edit Hero Slide</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Subtitle"
          type="text"
          required
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        />

        <AdminInput
          label="Title"
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div className="space-y-2">
          <AdminInput
            label="Image URL"
            type="text"
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          {form.imageUrl && (
            <div className="w-full h-48 relative border border-line rounded overflow-hidden">
              <Image
                src={form.imageUrl}
                alt="Preview"
                fill
                className="object-contain"
                onError={() => setError('Invalid image URL')}
              />
            </div>
          )}
        </div>

        <AdminInput
          label="CTA Text"
          type="text"
          value={form.ctaText || ''}
          onChange={(e) => setForm({ ...form, ctaText: e.target.value || null })}
        />

        <AdminInput
          label="CTA Link"
          type="text"
          value={form.ctaLink || ''}
          onChange={(e) => setForm({ ...form, ctaLink: e.target.value || null })}
        />

        <AdminInput
          label="Display Order"
          type="number"
          value={form.displayOrder}
          onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isActive" className="text-title">
            Is Active
          </label>
        </div>

        <AdminInput
          label="Image Width Classes (Optional)"
          type="text"
          value={form.imageWidth || ''}
          onChange={(e) => setForm({ ...form, imageWidth: e.target.value || null })}
        />

        <AdminInput
          label="Image Position Classes (Optional)"
          type="text"
          value={form.imagePosition || ''}
          onChange={(e) => setForm({ ...form, imagePosition: e.target.value || null })}
        />

        {error && <div className="text-red text-sm">{error}</div>}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-line rounded-lg text-title hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="button-main"
          >
            {loading ? 'Updating...' : 'Update Slide'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditHeroSlidePage

