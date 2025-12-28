'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput } from '@/components/Admin/AdminFormField'
import { ImageUploadField } from '@/components/Admin/ImageUploadField'

const NewHeroSlidePage = () => {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'id'>('en')
  const [form, setForm] = useState({
    subtitleEn: '',
    subtitleId: '',
    titleEn: '',
    titleId: '',
    imageUrl: '',
    ctaTextEn: 'Shop Now',
    ctaTextId: '',
    ctaLink: '/shop/breadcrumb-img',
    isActive: true,
    displayOrder: 0,
    imageWidth: '',
    imagePosition: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Build translation objects
      const subtitleTranslations = {
        en: form.subtitleEn.trim(),
        id: form.subtitleId.trim() || undefined,
      }
      const titleTranslations = {
        en: form.titleEn.trim(),
        id: form.titleId.trim() || undefined,
      }
      const ctaTextTranslations = form.ctaTextEn.trim()
        ? {
            en: form.ctaTextEn.trim(),
            id: form.ctaTextId.trim() || undefined,
          }
        : null

      const payload = {
        subtitleTranslations,
        titleTranslations,
        imageUrl: form.imageUrl,
        ctaTextTranslations,
        ctaLink: form.ctaLink || null,
        imageWidth: form.imageWidth || null,
        imagePosition: form.imagePosition || null,
        displayOrder: form.displayOrder || undefined,
        isActive: form.isActive,
      }

      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/hero-slides')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to create hero slide')
      }
    } catch (error) {
      console.error('Error creating hero slide:', error)
      setError('Failed to create hero slide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">New Hero Slide</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          label={`Subtitle (${activeLanguage === 'en' ? 'English' : 'Indonesian'})`}
          type="text"
          required={activeLanguage === 'en'}
          value={activeLanguage === 'en' ? form.subtitleEn : form.subtitleId}
          onChange={(e) =>
            setForm({
              ...form,
              [activeLanguage === 'en' ? 'subtitleEn' : 'subtitleId']: e.target.value,
            })
          }
          placeholder={activeLanguage === 'en' ? 'Sale! Up To 50% Off!' : 'Enter subtitle in Indonesian (optional)'}
        />

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
          placeholder={activeLanguage === 'en' ? 'Summer Sale Collections' : 'Enter title in Indonesian (optional)'}
        />

        <ImageUploadField
          label="Hero Image"
          value={form.imageUrl}
          onChange={(value) => setForm({ ...form, imageUrl: Array.isArray(value) ? value[0] : value })}
          entityType="hero-slides"
          required
        />

        <AdminInput
          label={`CTA Text (${activeLanguage === 'en' ? 'English' : 'Indonesian'})`}
          type="text"
          value={activeLanguage === 'en' ? form.ctaTextEn : form.ctaTextId}
          onChange={(e) =>
            setForm({
              ...form,
              [activeLanguage === 'en' ? 'ctaTextEn' : 'ctaTextId']: e.target.value,
            })
          }
          placeholder={activeLanguage === 'en' ? 'Shop Now' : 'Enter CTA text in Indonesian (optional)'}
        />

        <AdminInput
          label="CTA Link"
          type="text"
          value={form.ctaLink}
          onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
          placeholder="/shop/breadcrumb-img"
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
          value={form.imageWidth}
          onChange={(e) => setForm({ ...form, imageWidth: e.target.value })}
          placeholder='sm:w-[48%] w-[54%]'
        />

        <AdminInput
          label="Image Position Classes (Optional)"
          type="text"
          value={form.imagePosition}
          onChange={(e) => setForm({ ...form, imagePosition: e.target.value })}
          placeholder='2xl:-right-[60px] right-0 bottom-0'
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
            {loading ? 'Creating...' : 'Create Slide'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewHeroSlidePage

