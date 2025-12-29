'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

interface PromotionalPage {
  id: string
  title: string
  description: string
  imageUrl: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

const AdminPromotionalPagesPage = () => {
  const [pages, setPages] = useState<PromotionalPage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; page: PromotionalPage | null }>({
    isOpen: false,
    page: null,
  })
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadPages()
  }, [statusFilter])

  const loadPages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      if (statusFilter === 'active') params.append('active', 'true')
      if (statusFilter === 'inactive') params.append('active', 'false')
      const res = await fetch(`/api/promotional-pages?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setPages(json.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.page) return
    try {
      const res = await fetch(`/api/promotional-pages/${deleteDialog.page.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadPages()
        setDeleteDialog({ isOpen: false, page: null })
      }
    } catch (error) {
      console.error('Failed to delete promotional page:', error)
    }
  }

  const handleToggleActive = async (page: PromotionalPage) => {
    try {
      const res = await fetch(`/api/promotional-pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !page.isActive }),
      })
      if (res.ok) {
        loadPages()
      }
    } catch (error) {
      console.error('Failed to toggle promotional page:', error)
    }
  }

  const columns = [
    {
      key: 'imageUrl',
      label: 'Image',
      sortable: false,
      render: (value: string) => (
        <div className="relative w-20 h-20">
          <Image
            src={value}
            alt="Promotion"
            fill
            className="object-cover rounded"
            sizes="80px"
          />
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
    },
    {
      key: 'displayOrder',
      label: 'Order',
      sortable: true,
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
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="heading4">Promotional Pages</h1>
          <Link href="/admin/promotional-pages/new" className="button-main">
            New Promotional Page
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
          data={pages}
          columns={columns}
          loading={loading}
          actions={(page) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/promotional-pages/${page.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleActive(page)
                }}
                className="text-green hover:underline"
              >
                {page.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, page })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No promotional pages found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Promotional Page"
        message={`Are you sure you want to delete "${deleteDialog.page?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, page: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminPromotionalPagesPage

