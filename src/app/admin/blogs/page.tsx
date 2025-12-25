'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

interface Blog {
  id: string
  title: string
  slug: string
  category: string
  tag: string | null
  author: string
  date: string
  createdAt: string
  updatedAt: string
}

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; blog: Blog | null }>({
    isOpen: false,
    blog: null,
  })
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    loadBlogs()
  }, [categoryFilter])

  const loadBlogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      const res = await fetch(`/api/blogs?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setBlogs(json.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.blog) return
    try {
      const res = await fetch(`/api/blogs/${deleteDialog.blog.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadBlogs()
        setDeleteDialog({ isOpen: false, blog: null })
      }
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  const columns = [
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
      key: 'author',
      label: 'Author',
      sortable: true,
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
          <h1 className="heading4">Blogs</h1>
          <Link href="/admin/blogs/new" className="button-main">
            New Blog
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
        </div>

        <DataTable
          data={blogs}
          columns={columns}
          loading={loading}
          actions={(blog) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/blogs/${blog.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, blog })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No blogs found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteDialog.blog?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, blog: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminBlogsPage

