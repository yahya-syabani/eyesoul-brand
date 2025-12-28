'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput, AdminTextarea, AdminSelect } from '@/components/Admin/AdminFormField'
import { ImageUploadField } from '@/components/Admin/ImageUploadField'

const NewTestimonialPage = () => {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'id'>('en')
  const [form, setForm] = useState({
    name: '',
    titleEn: '',
    titleId: '',
    descriptionEn: '',
    descriptionId: '',
    avatar: '',
    images: [] as string[],
    star: 5,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    address: '',
    category: 'eyewear',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Build translation objects
      const titleTranslations = {
        en: form.titleEn.trim(),
        id: form.titleId.trim() || undefined,
      }
      const descriptionTranslations = {
        en: form.descriptionEn.trim(),
        id: form.descriptionId.trim() || undefined,
      }

      const payload = {
        name: form.name,
        titleTranslations,
        descriptionTranslations,
        avatar: form.avatar || null,
        address: form.address || null,
        images: form.images,
        star: form.star,
        date: form.date,
        category: form.category,
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

        {/* Language Tabs */}
        <div className="flex gap-2 border-b border-line mb-4">
          <button
            type="button"
            onClick={() => setActiveLanguage('en')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeLanguage === 'en'
                ? 'border-black text-black font-medium'
                : 'border-transparent text-secondary hover:text-black'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLanguage('id')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeLanguage === 'id'
                ? 'border-black text-black font-medium'
                : 'border-transparent text-secondary hover:text-black'
            }`}
          >
            Indonesian
          </button>
        </div>

        <AdminInput
          label={`Title (${activeLanguage === 'en' ? 'English' : 'Indonesian'})`}
          type="text"
          required={activeLanguage === 'en'}
          value={activeLanguage === 'en' ? form.titleEn : form.titleId}
          onChange={(e) =>
            setForm({
              ...form,
              [activeLanguage === 'en' ? 'titleEn' : 'titleId']: e.target.value,
            })
          }
          placeholder={activeLanguage === 'en' ? 'Enter testimonial title in English' : 'Enter testimonial title in Indonesian (optional)'}
        />

        <AdminTextarea
          label={`Description (${activeLanguage === 'en' ? 'English' : 'Indonesian'})`}
          required={activeLanguage === 'en'}
          rows={5}
          value={activeLanguage === 'en' ? form.descriptionEn : form.descriptionId}
          onChange={(e) =>
            setForm({
              ...form,
              [activeLanguage === 'en' ? 'descriptionEn' : 'descriptionId']: e.target.value,
            })
          }
          placeholder={activeLanguage === 'en' ? 'Enter testimonial description in English' : 'Enter testimonial description in Indonesian (optional)'}
        />

        <ImageUploadField
          label="Avatar Image"
          value={form.avatar}
          onChange={(value) => setForm({ ...form, avatar: Array.isArray(value) ? value[0] : value })}
          entityType="testimonials"
          aspectRatio="1/1"
        />

        <ImageUploadField
          label="Testimonial Images"
          value={form.images}
          onChange={(value) => setForm({ ...form, images: Array.isArray(value) ? value : [value] })}
          entityType="testimonials"
          multiple
          maxImages={10}
        />

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

