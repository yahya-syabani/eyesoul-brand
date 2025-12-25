'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProductType } from '@/type/ProductType'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'

const AdminProductsPage = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; product: ProductType | null }>({
    isOpen: false,
    product: null,
  })
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    loadProducts()
  }, [categoryFilter])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('limit', '100')
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setProducts(json.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.product) return
    try {
      const res = await fetch(`/api/products/${deleteDialog.product.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadProducts()
        setDeleteDialog({ isOpen: false, product: null })
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: number) => `$${Number(value).toFixed(2)}`,
    },
    {
      key: 'quantity',
      label: 'Stock',
      sortable: true,
    },
    {
      key: 'sold',
      label: 'Sold',
      sortable: true,
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="heading4">Products</h1>
          <Link href="/admin/products/new" className="button-main">
            New Product
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <select
            className="border border-line rounded px-3 py-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="prescription_glasses">Prescription Glasses</option>
            <option value="reading_glasses">Reading Glasses</option>
            <option value="contact_lenses">Contact Lenses</option>
            <option value="frames_only">Frames Only</option>
          </select>
        </div>

        <DataTable
          data={products}
          columns={columns}
          loading={loading}
          actions={(product) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, product })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No products found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, product: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminProductsPage

