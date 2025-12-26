'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminInput } from '@/components/Admin/AdminFormField'

interface Promotion {
  id: string
  code: string
  discountPercent: number
  minOrder: number
  isActive: boolean
  validFrom: string | null
  validUntil: string | null
  usageLimit: number | null
  usedCount: number
}

const EditPromotionPage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<Promotion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    loadPromotion()
  }, [id])

  const loadPromotion = async () => {
    try {
      const res = await fetch(`/api/promotions/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setForm({
          ...data,
          validFrom: data.validFrom ? new Date(data.validFrom).toISOString().slice(0, 16) : '',
          validUntil: data.validUntil ? new Date(data.validUntil).toISOString().slice(0, 16) : '',
        })
      } else {
        setError('Promotion not found')
      }
    } catch (error) {
      console.error('Error loading promotion:', error)
      setError('Failed to load promotion')
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
        code: form.code,
        discountPercent: form.discountPercent,
        minOrder: form.minOrder,
        isActive: form.isActive,
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
        usageLimit: form.usageLimit,
      }

      const res = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/promotions')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to update promotion')
      }
    } catch (error) {
      console.error('Error updating promotion:', error)
      setError('Failed to update promotion')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-secondary">Loading...</div>
  }

  if (!form) {
    return <div className="text-red">Promotion not found</div>
  }

  return (
    <div className="max-w-2xl">
      <h1 className="heading4 mb-6">Edit Promotion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Code"
          type="text"
          required
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
        />

        <AdminInput
          label="Discount Percent"
          type="number"
          required
          min="1"
          max="100"
          value={form.discountPercent}
          onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
        />

        <AdminInput
          label="Minimum Order Amount"
          type="number"
          required
          min="0"
          step="0.01"
          value={form.minOrder}
          onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
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
            Active
          </label>
        </div>

        <div className="text-secondary text-sm">
          Used: {form.usedCount} {form.usageLimit ? `of ${form.usageLimit}` : ''}
        </div>

        <AdminInput
          label="Valid From (optional)"
          type="datetime-local"
          value={form.validFrom || ''}
          onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
        />

        <AdminInput
          label="Valid Until (optional)"
          type="datetime-local"
          value={form.validUntil || ''}
          onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
        />

        <AdminInput
          label="Usage Limit (optional)"
          type="number"
          min="1"
          value={form.usageLimit || ''}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : null })}
          placeholder="Leave empty for unlimited"
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
            {loading ? 'Updating...' : 'Update Promotion'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPromotionPage

