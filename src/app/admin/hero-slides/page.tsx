'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

interface HeroSlide {
  id: string
  subtitle: string
  title: string
  imageUrl: string
  ctaText: string | null
  ctaLink: string | null
  isActive: boolean
  displayOrder: number
  imageWidth: string | null
  imagePosition: string | null
  createdAt: string
  updatedAt: string
}

const AdminHeroSlidesPage = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; slide: HeroSlide | null }>({
    isOpen: false,
    slide: null,
  })
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadSlides()
  }, [statusFilter])

  const loadSlides = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      const res = await fetch(`/api/hero-slides?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        let slidesData = json.data || []
        
        // Filter by status if needed
        if (statusFilter !== 'all') {
          const isActive = statusFilter === 'active'
          slidesData = slidesData.filter((slide: HeroSlide) => slide.isActive === isActive)
        }
        
        setSlides(slidesData)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.slide) return
    try {
      const res = await fetch(`/api/hero-slides/${deleteDialog.slide.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadSlides()
        setDeleteDialog({ isOpen: false, slide: null })
      }
    } catch (error) {
      console.error('Failed to delete hero slide:', error)
    }
  }

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const res = await fetch(`/api/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !slide.isActive }),
      })
      if (res.ok) {
        loadSlides()
      }
    } catch (error) {
      console.error('Failed to toggle slide status:', error)
    }
  }

  const columns = [
    {
      key: 'imageUrl',
      label: 'Image',
      sortable: false,
      render: (value: string) => (
        <div className="w-20 h-20 relative">
          <Image
            src={value}
            alt="Slide preview"
            fill
            className="object-cover rounded"
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
      key: 'subtitle',
      label: 'Subtitle',
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
      render: (value: boolean, row: HeroSlide) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleToggleActive(row)
          }}
          className={`px-2 py-1 rounded text-sm ${
            value ? 'bg-green text-white' : 'bg-secondary text-white'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </button>
      ),
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="heading4">Hero Slides</h1>
          <Link href="/admin/hero-slides/new" className="button-main">
            New Slide
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
          data={slides}
          columns={columns}
          loading={loading}
          actions={(slide) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/hero-slides/${slide.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, slide })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No hero slides found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Hero Slide"
        message={`Are you sure you want to delete the slide "${deleteDialog.slide?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, slide: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminHeroSlidesPage

