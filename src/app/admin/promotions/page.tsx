'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

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
  createdAt: string
  updatedAt: string
}

const AdminPromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; promotion: Promotion | null }>({
    isOpen: false,
    promotion: null,
  })
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadPromotions()
  }, [statusFilter])

  const loadPromotions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      if (statusFilter === 'active') params.append('isActive', 'true')
      if (statusFilter === 'inactive') params.append('isActive', 'false')
      if (statusFilter === 'expired') params.append('expired', 'true')
      const res = await fetch(`/api/promotions?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setPromotions(json.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.promotion) return
    try {
      const res = await fetch(`/api/promotions/${deleteDialog.promotion.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadPromotions()
        setDeleteDialog({ isOpen: false, promotion: null })
      }
    } catch (error) {
      console.error('Failed to delete promotion:', error)
    }
  }

  const handleToggleActive = async (promotion: Promotion) => {
    try {
      const res = await fetch(`/api/promotions/${promotion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promotion.isActive }),
      })
      if (res.ok) {
        loadPromotions()
      }
    } catch (error) {
      console.error('Failed to toggle promotion:', error)
    }
  }

  const columns = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
    },
    {
      key: 'discountPercent',
      label: 'Discount %',
      sortable: true,
      render: (value: number) => `${value}%`,
    },
    {
      key: 'minOrder',
      label: 'Min Order',
      sortable: true,
      render: (value: number) => `$${Number(value).toFixed(2)}`,
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
      key: 'usedCount',
      label: 'Used',
      sortable: true,
      render: (value: number, row: Promotion) =>
        row.usageLimit ? `${value}/${row.usageLimit}` : String(value),
    },
    {
      key: 'validUntil',
      label: 'Expires',
      sortable: true,
      render: (value: string | null) =>
        value ? new Date(value).toLocaleDateString() : 'No expiry',
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="heading4">Promotions</h1>
          <Link href="/admin/promotions/new" className="button-main">
            New Promotion
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
            <option value="expired">Expired</option>
          </select>
        </div>

        <DataTable
          data={promotions}
          columns={columns}
          loading={loading}
          actions={(promotion) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/promotions/${promotion.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleActive(promotion)
                }}
                className="text-green hover:underline"
              >
                {promotion.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, promotion })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No promotions found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Promotion"
        message={`Are you sure you want to delete promotion code "${deleteDialog.promotion?.code}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, promotion: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminPromotionsPage

