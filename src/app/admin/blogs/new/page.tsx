'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput, AdminTextarea } from '@/components/Admin/AdminFormField'
import { ImageUploadField } from '@/components/Admin/ImageUploadField'

const NewBlogPage = () => {
  const router = useRouter()
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'id'>('en')
  const [form, setForm] = useState({
    titleEn: '',
    titleId: '',
    slug: '',
    category: 'eyewear',
    tag: '',
    author: '',
    avatar: '',
    thumbImg: '',
    coverImg: '',
    subImg: [] as string[],
    shortDescEn: '',
    shortDescId: '',
    descriptionEn: '',
    descriptionId: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
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
      const shortDescTranslations = {
        en: form.shortDescEn.trim(),
        id: form.shortDescId.trim() || undefined,
      }
      const descriptionTranslations = {
        en: form.descriptionEn.trim(),
        id: form.descriptionId.trim() || undefined,
      }

      const payload = {
        titleTranslations,
        slug: form.slug,
        category: form.category,
        tag: form.tag || null,
        author: form.author,
        avatar: form.avatar || null,
        thumbImg: form.thumbImg || null,
        coverImg: form.coverImg || null,
        subImg: form.subImg,
        shortDescTranslations,
        descriptionTranslations,
        date: form.date,
      }

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/blogs')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to create blog')
      }
    } catch (error) {
      console.error('Error creating blog:', error)
      setError('Failed to create blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">New Blog</h1>
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
          placeholder={activeLanguage === 'en' ? 'Enter blog title in English' : 'Enter blog title in Indonesian (optional)'}
        />

        <AdminInput
          label="Slug"
          type="text"
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
          placeholder="blog-post-slug"
        />

        <AdminInput
          label="Category"
          type="text"
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <AdminInput
          label="Tag"
          type="text"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
        />

        <AdminInput
          label="Author"
          type="text"
          required
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <AdminInput
          label="Avatar URL"
          type="text"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
        />

        <ImageUploadField
          label="Thumbnail Image"
          value={form.thumbImg}
          onChange={(value) => setForm({ ...form, thumbImg: Array.isArray(value) ? value[0] : value })}
          entityType="blogs"
        />

        <ImageUploadField
          label="Cover Image"
          value={form.coverImg}
          onChange={(value) => setForm({ ...form, coverImg: Array.isArray(value) ? value[0] : value })}
          entityType="blogs"
        />

        <ImageUploadField
          label="Sub Images"
          value={form.subImg}
          onChange={(value) => setForm({ ...form, subImg: Array.isArray(value) ? value : [value] })}
          entityType="blogs"
          multiple
          maxImages={10}
        />

        <AdminTextarea
          label={`Short Description (${activeLanguage === 'en' ? 'English' : 'Indonesian'})`}
          required={activeLanguage === 'en'}
          rows={3}
          value={activeLanguage === 'en' ? form.shortDescEn : form.shortDescId}
          onChange={(e) =>
            setForm({
              ...form,
              [activeLanguage === 'en' ? 'shortDescEn' : 'shortDescId']: e.target.value,
            })
          }
          placeholder={activeLanguage === 'en' ? 'Enter short description in English' : 'Enter short description in Indonesian (optional)'}
        />

        <AdminTextarea
          label={`Description (${activeLanguage === 'en' ? 'English' : 'Indonesian'})`}
          required={activeLanguage === 'en'}
          rows={10}
          value={activeLanguage === 'en' ? form.descriptionEn : form.descriptionId}
          onChange={(e) =>
            setForm({
              ...form,
              [activeLanguage === 'en' ? 'descriptionEn' : 'descriptionId']: e.target.value,
            })
          }
          placeholder={activeLanguage === 'en' ? 'Enter blog description in English' : 'Enter blog description in Indonesian (optional)'}
        />

        <AdminInput
          label="Date"
          type="text"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          placeholder="Dec 20, 2023"
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
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewBlogPage

