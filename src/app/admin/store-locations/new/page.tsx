'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AdminInput } from '@/components/Admin/AdminFormField'

const NewStoreLocationPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    imageUrl: '',
    hoursWeekdays: 'Mon - Fri: 9:00am - 9:00pm',
    hoursSaturday: 'Saturday: 10:00am - 8:00pm',
    hoursSunday: 'Sunday: 11:00am - 7:00pm',
    mapUrl: '',
    latitude: 0,
    longitude: 0,
    isActive: true,
    displayOrder: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        imageUrl: form.imageUrl || null,
        hoursWeekdays: form.hoursWeekdays,
        hoursSaturday: form.hoursSaturday,
        hoursSunday: form.hoursSunday,
        mapUrl: form.mapUrl,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        isActive: form.isActive,
        displayOrder: Number(form.displayOrder),
      }

      const res = await fetch('/api/store-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/store-locations')
      } else {
        const json = await res.json()
        setError(json.error || 'Failed to create store location')
      }
    } catch (error) {
      console.error('Error creating store location:', error)
      setError('Failed to create store location')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">New Store Location</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Jakarta Central Store"
        />

        <AdminInput
          label="Address"
          type="text"
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Jl. Sudirman No. 123, Jakarta Pusat"
        />

        <AdminInput
          label="Phone"
          type="text"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+62 21 5555 1234"
        />

        <AdminInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="store@eyesoul.com"
        />

        <div className="space-y-2">
          <AdminInput
            label="Image URL"
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="/images/store-location/store1.png"
          />
          {form.imageUrl && (
            <div className="w-full h-48 relative border border-line rounded overflow-hidden">
              <Image
                src={form.imageUrl}
                alt="Preview"
                fill
                className="object-contain"
                onError={() => setError('Invalid image URL')}
              />
            </div>
          )}
        </div>

        <AdminInput
          label="Hours (Weekdays)"
          type="text"
          required
          value={form.hoursWeekdays}
          onChange={(e) => setForm({ ...form, hoursWeekdays: e.target.value })}
          placeholder="Mon - Fri: 9:00am - 9:00pm"
        />

        <AdminInput
          label="Hours (Saturday)"
          type="text"
          required
          value={form.hoursSaturday}
          onChange={(e) => setForm({ ...form, hoursSaturday: e.target.value })}
          placeholder="Saturday: 10:00am - 8:00pm"
        />

        <AdminInput
          label="Hours (Sunday)"
          type="text"
          required
          value={form.hoursSunday}
          onChange={(e) => setForm({ ...form, hoursSunday: e.target.value })}
          placeholder="Sunday: 11:00am - 7:00pm"
        />

        <AdminInput
          label="Map URL"
          type="url"
          required
          value={form.mapUrl}
          onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
          placeholder="https://www.google.com/maps/embed?pb=..."
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
            placeholder="-6.1946"
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
            placeholder="106.8176"
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
          placeholder="0"
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
            {loading ? 'Creating...' : 'Create Store Location'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewStoreLocationPage

