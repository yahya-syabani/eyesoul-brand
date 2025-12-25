'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput, AdminTextarea } from '@/components/Admin/AdminFormField'

const NewBlogPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'eyewear',
    tag: '',
    author: '',
    avatar: '',
    thumbImg: '',
    coverImg: '',
    subImg: [] as string[],
    shortDesc: '',
    description: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  })
  const [subImgInput, setSubImgInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const addSubImg = () => {
    if (subImgInput.trim()) {
      setForm({ ...form, subImg: [...form.subImg, subImgInput.trim()] })
      setSubImgInput('')
    }
  }

  const removeSubImg = (index: number) => {
    setForm({ ...form, subImg: form.subImg.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = {
        ...form,
        tag: form.tag || null,
        avatar: form.avatar || null,
        thumbImg: form.thumbImg || null,
        coverImg: form.coverImg || null,
        subImg: form.subImg,
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
        <AdminInput
          label="Title"
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
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

        <AdminInput
          label="Thumbnail Image URL"
          type="text"
          value={form.thumbImg}
          onChange={(e) => setForm({ ...form, thumbImg: e.target.value })}
        />

        <AdminInput
          label="Cover Image URL"
          type="text"
          value={form.coverImg}
          onChange={(e) => setForm({ ...form, coverImg: e.target.value })}
        />

        <div>
          <label className="text-title block mb-2">Sub Images</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={subImgInput}
              onChange={(e) => setSubImgInput(e.target.value)}
              placeholder="Image URL"
              className="flex-1 border border-line rounded px-3 py-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSubImg()
                }
              }}
            />
            <button
              type="button"
              onClick={addSubImg}
              className="px-4 py-2 border border-line rounded-lg hover:bg-surface"
            >
              Add
            </button>
          </div>
          <div className="space-y-1">
            {form.subImg.map((img, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-secondary flex-1 truncate">{img}</span>
                <button
                  type="button"
                  onClick={() => removeSubImg(index)}
                  className="text-red text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <AdminTextarea
          label="Short Description"
          required
          rows={3}
          value={form.shortDesc}
          onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
        />

        <AdminTextarea
          label="Description"
          required
          rows={10}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
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

