'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const AdminProductsPage = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products?limit=100', { cache: 'no-store' })
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
    load()
  }, [])

  return (
    <div className="container py-10 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="heading4">Products</h1>
        <Link href="/admin/products/new" className="button-main">New Product</Link>
      </div>
      {loading ? (
        <div className="text-secondary">Loading products...</div>
      ) : (
        <div className="border border-line rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 bg-surface px-4 py-2 text-title text-secondary">
            <div>Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Actions</div>
          </div>
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-5 px-4 py-3 border-t border-line items-center">
              <div className="text-title">{product.name}</div>
              <div className="caption1 text-secondary">{product.category}</div>
              <div className="caption1 text-secondary">${Number(product.price).toFixed(2)}</div>
              <div className="caption1 text-secondary">{product.quantity}</div>
              <div className="flex gap-2">
                <Link href={`/admin/products/${product.id}/edit`} className="caption1 underline">Edit</Link>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="px-4 py-6 text-secondary">No products found.</div>}
        </div>
      )}
    </div>
  )
}

export default AdminProductsPage

