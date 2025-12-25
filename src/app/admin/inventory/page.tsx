'use client'

import React, { useEffect, useState } from 'react'
import { ProductType } from '@/type/ProductType'

const AdminInventoryPage = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products?limit=200', { cache: 'no-store' })
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
        <h1 className="heading4">Inventory</h1>
      </div>
      {loading ? (
        <div className="text-secondary">Loading inventory...</div>
      ) : (
        <div className="border border-line rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 bg-surface px-4 py-2 text-title text-secondary">
            <div>Name</div>
            <div>Category</div>
            <div>In Stock</div>
            <div>Sold</div>
          </div>
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-4 px-4 py-3 border-t border-line">
              <div className="text-title">{product.name}</div>
              <div className="caption1 text-secondary">{product.category}</div>
              <div className="caption1 text-secondary">{product.quantity}</div>
              <div className="caption1 text-secondary">{product.sold}</div>
            </div>
          ))}
          {products.length === 0 && <div className="px-4 py-6 text-secondary">No inventory data.</div>}
        </div>
      )}
    </div>
  )
}

export default AdminInventoryPage

