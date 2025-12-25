'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput } from '@/components/Admin/AdminFormField'

const NewPromotionPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    code: '',
    discountPercent: 10,
    minOrder: 0,
    isActive: true,
    validFrom: '',
    validUntil: '',
    usageLimit: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = {
        code: form.code,
        discountPercent: Number(form.discountPercent),
        minOrder: Number(form.minOrder),
        isActive: form.isActive,
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      }

      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/promotions')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to create promotion')
      }
    } catch (error) {
      console.error('Error creating promotion:', error)
      setError('Failed to create promotion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="heading4 mb-6">New Promotion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Code"
          type="text"
          required
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          placeholder="AN6810"
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

        <AdminInput
          label="Valid From (optional)"
          type="datetime-local"
          value={form.validFrom}
          onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
        />

        <AdminInput
          label="Valid Until (optional)"
          type="datetime-local"
          value={form.validUntil}
          onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
        />

        <AdminInput
          label="Usage Limit (optional)"
          type="number"
          min="1"
          value={form.usageLimit}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
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
            {loading ? 'Creating...' : 'Create Promotion'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPromotionPage

