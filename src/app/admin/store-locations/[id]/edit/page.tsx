'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminInput } from '@/components/Admin/AdminFormField'

interface StoreLocation {
  id: string
  name: string
  address: string
  phone: string
  email: string | null
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  mapUrl: string
  coordinates: {
    lat: number
    lng: number
  }
  isActive: boolean
  displayOrder: number
}

const EditStoreLocationPage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<{
    name: string
    address: string
    phone: string
    email: string
    hoursWeekdays: string
    hoursSaturday: string
    hoursSunday: string
    mapUrl: string
    latitude: number
    longitude: number
    isActive: boolean
    displayOrder: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    loadStoreLocation()
  }, [id])

  const loadStoreLocation = async () => {
    try {
      const res = await fetch(`/api/store-locations/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const data: StoreLocation = await res.json()
        // Transform API response to form fields
        setForm({
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email || '',
          hoursWeekdays: data.hours.weekdays,
          hoursSaturday: data.hours.saturday,
          hoursSunday: data.hours.sunday,
          mapUrl: data.mapUrl,
          latitude: data.coordinates.lat,
          longitude: data.coordinates.lng,
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        })
      } else {
        setError('Store location not found')
      }
    } catch (error) {
      console.error('Error loading store location:', error)
      setError('Failed to load store location')
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
      // Validate coordinates
      if (form.latitude < -90 || form.latitude > 90) {
        setError('Latitude must be between -90 and 90')
        setLoading(false)
        return
      }
      if (form.longitude < -180 || form.longitude > 180) {
        setError('Longitude must be between -180 and 180')
        setLoading(false)
        return
      }

      // Validate URL
      try {
        new URL(form.mapUrl)
      } catch {
        setError('Map URL must be a valid URL')
        setLoading(false)
        return
      }

      const payload = {
        name: form.name,
        address: form.address,
        phone: form.phone,
        email: form.email || null,
        hoursWeekdays: form.hoursWeekdays,
        hoursSaturday: form.hoursSaturday,
        hoursSunday: form.hoursSunday,
        mapUrl: form.mapUrl,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        isActive: form.isActive,
        displayOrder: Number(form.displayOrder),
      }

      const res = await fetch(`/api/store-locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/store-locations')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to update store location')
      }
    } catch (error) {
      console.error('Error updating store location:', error)
      setError('Failed to update store location')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-secondary">Loading...</div>
  }

  if (!form) {
    return <div className="text-red">Store location not found</div>
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">Edit Store Location</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <AdminInput
          label="Address"
          type="text"
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <AdminInput
          label="Phone"
          type="text"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <AdminInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <AdminInput
          label="Hours (Weekdays)"
          type="text"
          required
          value={form.hoursWeekdays}
          onChange={(e) => setForm({ ...form, hoursWeekdays: e.target.value })}
        />

        <AdminInput
          label="Hours (Saturday)"
          type="text"
          required
          value={form.hoursSaturday}
          onChange={(e) => setForm({ ...form, hoursSaturday: e.target.value })}
        />

        <AdminInput
          label="Hours (Sunday)"
          type="text"
          required
          value={form.hoursSunday}
          onChange={(e) => setForm({ ...form, hoursSunday: e.target.value })}
        />

        <AdminInput
          label="Map URL"
          type="url"
          required
          value={form.mapUrl}
          onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <AdminInput
            label="Latitude"
            type="number"
            required
            step="any"
            min="-90"
            max="90"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })}
          />

          <AdminInput
            label="Longitude"
            type="number"
            required
            step="any"
            min="-180"
            max="180"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
          />
        </div>

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
          label="Display Order"
          type="number"
          value={form.displayOrder}
          onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
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
            {loading ? 'Updating...' : 'Update Store Location'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditStoreLocationPage

