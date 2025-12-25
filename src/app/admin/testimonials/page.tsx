'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

interface Testimonial {
  id: string
  name: string
  title: string
  category: string
  star: number
  date: string
  createdAt: string
  updatedAt: string
}

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; testimonial: Testimonial | null }>({
    isOpen: false,
    testimonial: null,
  })
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [starFilter, setStarFilter] = useState<string>('all')

  useEffect(() => {
    loadTestimonials()
  }, [categoryFilter, starFilter])

  const loadTestimonials = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (starFilter !== 'all') params.append('star', starFilter)
      const res = await fetch(`/api/testimonials?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setTestimonials(json.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.testimonial) return
    try {
      const res = await fetch(`/api/testimonials/${deleteDialog.testimonial.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadTestimonials()
        setDeleteDialog({ isOpen: false, testimonial: null })
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'star',
      label: 'Rating',
      sortable: true,
      render: (value: number) => '⭐'.repeat(value),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="heading4">Testimonials</h1>
          <Link href="/admin/testimonials/new" className="button-main">
            New Testimonial
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <select
            className="border border-line rounded px-3 py-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="eyewear">Eyewear</option>
          </select>
          <select
            className="border border-line rounded px-3 py-2"
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <DataTable
          data={testimonials}
          columns={columns}
          loading={loading}
          actions={(testimonial) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/testimonials/${testimonial.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, testimonial })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No testimonials found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Testimonial"
        message={`Are you sure you want to delete testimonial from "${deleteDialog.testimonial?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, testimonial: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminTestimonialsPage

