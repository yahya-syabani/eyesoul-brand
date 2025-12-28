'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

interface StoreLocation {
  id: string
  name: string
  address: string
  province: string
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
  createdAt: string
  updatedAt: string
}

const AdminStoreLocationsPage = () => {
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; location: StoreLocation | null }>({
    isOpen: false,
    location: null,
  })
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadStoreLocations()
  }, [statusFilter])

  const loadStoreLocations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('includeInactive', 'true')
      const res = await fetch(`/api/store-locations?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        let locations = json.data || []
        
        // Filter by status if needed
        if (statusFilter !== 'all') {
          const isActive = statusFilter === 'active'
          locations = locations.filter((loc: StoreLocation) => loc.isActive === isActive)
        }
        
        setStoreLocations(locations)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.location) return
    try {
      const res = await fetch(`/api/store-locations/${deleteDialog.location.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadStoreLocations()
        setDeleteDialog({ isOpen: false, location: null })
      }
    } catch (error) {
      console.error('Failed to delete store location:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (value: string) => (
        <span className="max-w-xs truncate block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'province',
      label: 'Province',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: string | null) => value || '-',
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <span className={value ? 'text-green' : 'text-secondary'}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'displayOrder',
      label: 'Order',
      sortable: true,
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="heading4">Store Locations</h1>
          <Link href="/admin/store-locations/new" className="button-main">
            New Store Location
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <select
            className="border border-line rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <DataTable
          data={storeLocations}
          columns={columns}
          loading={loading}
          actions={(location) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/store-locations/${location.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, location })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No store locations found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Store Location"
        message={`Are you sure you want to delete "${deleteDialog.location?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, location: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminStoreLocationsPage

