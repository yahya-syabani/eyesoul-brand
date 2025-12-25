'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { SerializedOrderWithRelations } from '@/lib/prisma-types'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<SerializedOrderWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; order: SerializedOrderWithRelations | null }>({
    isOpen: false,
    order: null,
  })
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      if (statusFilter !== 'all') params.append('status', statusFilter)
      const res = await fetch(`/api/orders?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setOrders(json.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.order) return
    try {
      const res = await fetch(`/api/orders/${deleteDialog.order.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadOrders()
        setDeleteDialog({ isOpen: false, order: null })
      }
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
  }

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (value: string) => (
        <Link href={`/admin/orders/${value}`} className="text-blue hover:underline">
          {value.slice(0, 8)}...
        </Link>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            value === 'DELIVERED'
              ? 'bg-green/10 text-green'
              : value === 'CANCELLED'
              ? 'bg-red/10 text-red'
              : value === 'SHIPPED'
              ? 'bg-blue/10 text-blue'
              : 'bg-yellow/10 text-yellow'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (value: number) => `$${Number(value).toFixed(2)}`,
    },
    {
      key: 'items',
      label: 'Items',
      render: (value: any[]) => value?.length ?? 0,
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <h1 className="heading4">Orders</h1>

        <div className="flex gap-4 items-center">
          <select
            className="border border-line rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <DataTable
          data={orders}
          columns={columns}
          loading={loading}
          onRowClick={(order) => window.location.href = `/admin/orders/${order.id}`}
          actions={(order) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View
              </Link>
              <Link
                href={`/admin/orders/${order.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, order })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No orders found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Order"
        message={`Are you sure you want to delete order ${deleteDialog.order?.id.slice(0, 8)}...? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, order: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminOrdersPage

