'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminInput, AdminSelect } from '@/components/Admin/AdminFormField'

const NewUserPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'CUSTOMER' as 'ADMIN' | 'CUSTOMER',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || json.message || 'Failed to create user')
        return
      }
      router.push('/admin/users')
    } catch (err) {
      setError('Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="heading4 mb-6">New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          error={error || undefined}
        />
        <AdminInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={8}
        />
        <AdminSelect
          label="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as 'ADMIN' | 'CUSTOMER' })}
          options={[
            { value: 'CUSTOMER', label: 'Customer' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
          required
        />
        {error && <div className="text-red">{error}</div>}
        <div className="flex gap-3">
          <button type="submit" className="button-main" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-line rounded-lg hover:bg-surface"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewUserPage

