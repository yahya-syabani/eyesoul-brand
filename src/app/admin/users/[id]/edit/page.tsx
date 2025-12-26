'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminInput, AdminSelect } from '@/components/Admin/AdminFormField'

const EditUserPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    email: '',
    role: 'CUSTOMER' as 'ADMIN' | 'CUSTOMER',
    password: '',
  })
  const [updatePassword, setUpdatePassword] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/users/${id}`, { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          setForm({
            email: json.email || '',
            role: json.role || 'CUSTOMER',
            password: '',
          })
        } else {
          setError('User not found')
        }
      } catch (err) {
        setError('Failed to load user')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const updateData: any = {
        email: form.email,
        role: form.role,
      }
      if (updatePassword && form.password) {
        updateData.password = form.password
      }

      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || json.message || 'Failed to update user')
        return
      }
      router.push('/admin/users')
    } catch (err) {
      setError('Failed to update user')
    }
  }

  if (loading) {
    return <div className="text-secondary">Loading user...</div>
  }

  if (error && !form.email) {
    return <div className="text-red">{error}</div>
  }

  return (
    <div className="max-w-2xl">
      <h1 className="heading4 mb-6">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          error={error || undefined}
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
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={updatePassword}
              onChange={(e) => setUpdatePassword(e.target.checked)}
            />
            <span className="text-title">Update Password</span>
          </label>
          {updatePassword && (
            <AdminInput
              label="New Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={8}
            />
          )}
        </div>
        {error && <div className="text-red">{error}</div>}
        <div className="flex gap-3">
          <button type="submit" className="button-main">
            Save Changes
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

export default EditUserPage

