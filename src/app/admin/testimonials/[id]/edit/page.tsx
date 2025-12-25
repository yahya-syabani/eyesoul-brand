'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminInput, AdminTextarea, AdminSelect } from '@/components/Admin/AdminFormField'

interface Testimonial {
  id: string
  name: string
  title: string
  description: string
  avatar: string | null
  images: string[]
  star: number
  date: string
  address: string | null
  category: string
}

const EditTestimonialPage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<Testimonial | null>(null)
  const [imageInput, setImageInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    loadTestimonial()
  }, [id])

  const loadTestimonial = async () => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setForm(data)
      } else {
        setError('Testimonial not found')
      }
    } catch (error) {
      console.error('Error loading testimonial:', error)
      setError('Failed to load testimonial')
    } finally {
      setFetching(false)
    }
  }

  const addImage = () => {
    if (imageInput.trim() && form) {
      setForm({ ...form, images: [...form.images, imageInput.trim()] })
      setImageInput('')
    }
  }

  const removeImage = (index: number) => {
    if (form) {
      setForm({ ...form, images: form.images.filter((_, i) => i !== index) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    setError(null)
    setLoading(true)

    try {
      const payload = {
        ...form,
        avatar: form.avatar || null,
        address: form.address || null,
      }

      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/testimonials')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to update testimonial')
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
      setError('Failed to update testimonial')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-secondary">Loading...</div>
  }

  if (!form) {
    return <div className="text-red">Testimonial not found</div>
  }

  return (
    <div className="max-w-2xl">
      <h1 className="heading4 mb-6">Edit Testimonial</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <AdminInput
          label="Title"
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <AdminTextarea
          label="Description"
          required
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <AdminInput
          label="Avatar URL"
          type="text"
          value={form.avatar || ''}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
        />

        <div>
          <label className="text-title block mb-2">Images</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Image URL"
              className="flex-1 border border-line rounded px-3 py-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addImage()
                }
              }}
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 border border-line rounded-lg hover:bg-surface"
            >
              Add
            </button>
          </div>
          <div className="space-y-1">
            {form.images.map((img, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-secondary flex-1 truncate">{img}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <AdminSelect
          label="Star Rating"
          required
          value={String(form.star)}
          onChange={(e) => setForm({ ...form, star: Number(e.target.value) })}
          options={[
            { value: '1', label: '1 Star' },
            { value: '2', label: '2 Stars' },
            { value: '3', label: '3 Stars' },
            { value: '4', label: '4 Stars' },
            { value: '5', label: '5 Stars' },
          ]}
        />

        <AdminInput
          label="Date"
          type="text"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <AdminInput
          label="Address"
          type="text"
          value={form.address || ''}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <AdminInput
          label="Category"
          type="text"
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
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
            {loading ? 'Updating...' : 'Update Testimonial'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTestimonialPage

