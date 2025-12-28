'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput } from '@/components/Admin/AdminFormField'

// Helper function to generate URL-friendly slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

const NewTagPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generatedSlug = form.name ? generateSlug(form.name) : ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = {
        name: form.name.trim(),
      }

      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/tags')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to create tag')
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      setError('Failed to create tag')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="heading4 mb-6">New Tag</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter tag name"
        />

        <div className="space-y-1">
          <label className="text-title">Slug (auto-generated)</label>
          <input
            type="text"
            value={generatedSlug}
            readOnly
            className="w-full border border-line rounded px-3 py-2 bg-surface text-secondary"
            placeholder="Slug will be generated from name"
          />
          <p className="text-sm text-secondary">
            The slug is automatically generated from the tag name. It will be used in URLs.
          </p>
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
          <button type="submit" disabled={loading} className="button-main">
            {loading ? 'Creating...' : 'Create Tag'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewTagPage

