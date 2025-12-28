'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminInput, AdminTextarea } from '@/components/Admin/AdminFormField'
import { ImageUploadField } from '@/components/Admin/ImageUploadField'

interface Blog {
  id: string
  title: string
  slug: string
  category: string
  tag: string | null
  author: string
  avatar: string | null
  thumbImg: string | null
  coverImg: string | null
  subImg: string[]
  shortDesc: string
  description: string
  date: string
}

const EditBlogPage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<Blog | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    loadBlog()
  }, [id])

  const loadBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setForm(data)
      } else {
        setError('Blog not found')
      }
    } catch (error) {
      console.error('Error loading blog:', error)
      setError('Failed to load blog')
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
        ...form,
        tag: form.tag || null,
        avatar: form.avatar || null,
        thumbImg: form.thumbImg || null,
        coverImg: form.coverImg || null,
      }

      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/blogs')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      setError('Failed to update blog')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-secondary">Loading...</div>
  }

  if (!form) {
    return <div className="text-red">Blog not found</div>
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">Edit Blog</h1>
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
          value={form.tag || ''}
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
          value={form.avatar || ''}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
        />

        <ImageUploadField
          label="Thumbnail Image"
          value={form.thumbImg || ''}
          onChange={(value) => setForm({ ...form, thumbImg: Array.isArray(value) ? value[0] : value })}
          entityType="blogs"
        />

        <ImageUploadField
          label="Cover Image"
          value={form.coverImg || ''}
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
            {loading ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditBlogPage

