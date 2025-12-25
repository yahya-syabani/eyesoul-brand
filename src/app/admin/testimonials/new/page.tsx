'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput, AdminTextarea, AdminSelect } from '@/components/Admin/AdminFormField'

const NewTestimonialPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    avatar: '',
    images: [] as string[],
    star: 5,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    address: '',
    category: 'eyewear',
  })
  const [imageInput, setImageInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const addImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, images: [...form.images, imageInput.trim()] })
      setImageInput('')
    }
  }

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = {
        ...form,
        avatar: form.avatar || null,
        address: form.address || null,
        images: form.images,
      }

      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/testimonials')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to create testimonial')
      }
    } catch (error) {
      console.error('Error creating testimonial:', error)
      setError('Failed to create testimonial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="heading4 mb-6">New Testimonial</h1>
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
          value={form.avatar}
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
          placeholder="November 10, 2023"
        />

        <AdminInput
          label="Address"
          type="text"
          value={form.address}
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
            {loading ? 'Creating...' : 'Create Testimonial'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewTestimonialPage

