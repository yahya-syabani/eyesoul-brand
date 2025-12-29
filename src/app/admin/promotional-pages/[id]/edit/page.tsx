'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminInput } from '@/components/Admin/AdminFormField'
import { ImageUploadField } from '@/components/Admin/ImageUploadField'

interface PromotionalPage {
  id: string
  title: string
  description: string
  imageUrl: string
  isActive: boolean
  displayOrder: number
  titleTranslations?: { en: string; id?: string }
  descriptionTranslations?: { en: string; id?: string }
}

const EditPromotionalPagePage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'id'>('en')
  const [form, setForm] = useState({
    titleEn: '',
    titleId: '',
    descriptionEn: '',
    descriptionId: '',
    imageUrl: '',
    isActive: true,
    displayOrder: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (id) {
      loadPage(id)
    }
  }, [id])

  const loadPage = async (pageId: string) => {
    setFetching(true)
    try {
      const res = await fetch(`/api/promotional-pages/${pageId}`)
      if (res.ok) {
        const page: PromotionalPage = await res.json()
        setForm({
          titleEn: page.titleTranslations?.en || page.title || '',
          titleId: page.titleTranslations?.id || '',
          descriptionEn: page.descriptionTranslations?.en || page.description || '',
          descriptionId: page.descriptionTranslations?.id || '',
          imageUrl: page.imageUrl,
          isActive: page.isActive,
          displayOrder: page.displayOrder,
        })
      } else {
        setError('Failed to load promotional page')
      }
    } catch (error) {
      console.error('Error loading promotional page:', error)
      setError('Failed to load promotional page')
    } finally {
      setFetching(false)
    }
  }

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
        titleTranslations,
        descriptionTranslations,
        imageUrl: form.imageUrl,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
      }

      const res = await fetch(`/api/promotional-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/promotional-pages')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to update promotional page')
      }
    } catch (error) {
      console.error('Error updating promotional page:', error)
      setError('Failed to update promotional page')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-4xl">
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">Edit Promotional Page</h1>
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
          placeholder={activeLanguage === 'en' ? 'Enter title' : 'Enter title in Indonesian (optional)'}
        />

        <div className="space-y-2">
          <label className="text-title">
            Description ({activeLanguage === 'en' ? 'English' : 'Indonesian'})
            {activeLanguage === 'en' && <span className="text-red ml-1">*</span>}
          </label>
          <textarea
            value={activeLanguage === 'en' ? form.descriptionEn : form.descriptionId}
            onChange={(e) =>
              setForm({
                ...form,
                [activeLanguage === 'en' ? 'descriptionEn' : 'descriptionId']: e.target.value,
              })
            }
            placeholder={activeLanguage === 'en' ? 'Enter description' : 'Enter description in Indonesian (optional)'}
            required={activeLanguage === 'en'}
            rows={6}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <ImageUploadField
          label="Promotion Image"
          value={form.imageUrl}
          onChange={(value) => setForm({ ...form, imageUrl: Array.isArray(value) ? value[0] : value })}
          entityType="promotional-pages"
          required
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
            {loading ? 'Updating...' : 'Update Promotional Page'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPromotionalPagePage
