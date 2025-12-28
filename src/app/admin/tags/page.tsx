'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

interface Tag {
  id: string
  name: string
  slug: string
  blogCount: number
  createdAt: string
  updatedAt: string
}

const AdminTagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; tag: Tag | null }>({
    isOpen: false,
    tag: null,
  })
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadTags()
  }, [search])

  const loadTags = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      if (search) params.append('search', search)
      const res = await fetch(`/api/tags?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setTags(json.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.tag) return
    try {
      const res = await fetch(`/api/tags/${deleteDialog.tag.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadTags()
        setDeleteDialog({ isOpen: false, tag: null })
      } else {
        const json = await res.json()
        alert(json.error || 'Failed to delete tag')
      }
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
    },
    {
      key: 'blogCount',
      label: 'Blog Count',
      sortable: true,
      render: (value: number) => value.toString(),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="heading4">Tags</h1>
          <Link href="/admin/tags/new" className="button-main">
            New Tag
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-line rounded px-3 py-2 flex-1 max-w-md"
          />
        </div>

        <DataTable
          data={tags}
          columns={columns}
          loading={loading}
          actions={(tag) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/tags/${tag.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, tag })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No tags found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Tag"
        message={`Are you sure you want to delete "${deleteDialog.tag?.name}"? This action cannot be undone.${
          deleteDialog.tag && deleteDialog.tag.blogCount > 0
            ? ` This tag is used in ${deleteDialog.tag.blogCount} blog(s).`
            : ''
        }`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, tag: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminTagsPage

