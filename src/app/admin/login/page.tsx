'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const AdminLoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.message || 'Login failed')
        return
      }
      router.push('/admin/dashboard')
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-4">
        <h1 className="heading4 text-center">Admin Login</h1>
        <div className="space-y-1">
          <label className="text-title">Email</label>
          <input
            type="email"
            className="w-full border border-line rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-title">Password</label>
          <input
            type="password"
            className="w-full border border-line rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red text-sm">{error}</div>}
        <button
          type="submit"
          className="button-main w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default AdminLoginPage

