'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SerializedOrderWithRelations } from '@/lib/prisma-types'
import { AdminSelect, AdminInput } from '@/components/Admin/AdminFormField'
import { OrderStatus } from '@prisma/client'

interface OrderItem {
  productId: string
  quantity: number
  price: number
  selectedSize?: string
  selectedColor?: string
}

const EditOrderPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    status: 'PENDING' as OrderStatus,
    shippingAddress: {} as Record<string, any>,
  })
  const [items, setItems] = useState<OrderItem[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, { cache: 'no-store' })
        if (res.ok) {
          const order: SerializedOrderWithRelations = await res.json()
          setForm({
            status: order.status,
            shippingAddress: order.shippingAddress as Record<string, any>,
          })
          setItems(
            order.items?.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              selectedSize: item.selectedSize || undefined,
              selectedColor: item.selectedColor || undefined,
            })) || []
          )
        } else {
          setError('Order not found')
        }
      } catch (err) {
        setError('Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        status: form.status,
        shippingAddress: form.shippingAddress,
        items: items.filter((item) => item.productId && item.quantity > 0),
      }

      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || json.message || 'Failed to update order')
        return
      }
      router.push(`/admin/orders/${id}`)
    } catch (err) {
      setError('Failed to update order')
    }
  }

  if (loading) {
    return <div className="text-secondary">Loading order...</div>
  }

  if (error && !form.status) {
    return <div className="text-red">{error}</div>
  }

  return (
    <div className="max-w-4xl">
      <h1 className="heading4 mb-6">Edit Order</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-line rounded-lg p-6 space-y-4">
          <h2 className="heading6 mb-4">Order Status</h2>
          <AdminSelect
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}
            options={[
              { value: 'PENDING', label: 'Pending' },
              { value: 'PROCESSING', label: 'Processing' },
              { value: 'SHIPPED', label: 'Shipped' },
              { value: 'DELIVERED', label: 'Delivered' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
            required
          />
        </div>

        <div className="border border-line rounded-lg p-6 space-y-4">
          <h2 className="heading6 mb-4">Shipping Address</h2>
          <div className="space-y-2">
            <textarea
              className="w-full border border-line rounded px-3 py-2 font-mono text-sm"
              rows={6}
              value={JSON.stringify(form.shippingAddress, null, 2)}
              onChange={(e) => {
                try {
                  setForm({ ...form, shippingAddress: JSON.parse(e.target.value) })
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              placeholder='{"firstName": "John", "lastName": "Doe", ...}'
            />
            <p className="text-secondary text-sm">Enter shipping address as JSON</p>
          </div>
        </div>

        <div className="border border-line rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="heading6">Order Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1 border border-line rounded text-sm hover:bg-surface"
            >
              Add Item
            </button>
          </div>
          {items.map((item, index) => (
            <div key={index} className="border border-line rounded p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-title">Item {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-4 gap-3">
                <AdminInput
                  label="Product ID"
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  required
                />
                <AdminInput
                  label="Quantity"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                  required
                />
                <AdminInput
                  label="Price"
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                  required
                />
                <div>
                  <label className="text-title text-sm mb-1 block">Subtotal</label>
                  <div className="px-3 py-2 border border-line rounded bg-surface">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <AdminInput
                  label="Size (optional)"
                  value={item.selectedSize || ''}
                  onChange={(e) => updateItem(index, 'selectedSize', e.target.value)}
                />
                <AdminInput
                  label="Color (optional)"
                  value={item.selectedColor || ''}
                  onChange={(e) => updateItem(index, 'selectedColor', e.target.value)}
                />
              </div>
            </div>
          ))}
          {items.length > 0 && (
            <div className="border-t border-line pt-4">
              <div className="flex justify-between items-center">
                <span className="text-title">Total:</span>
                <span className="heading6">
                  ${items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {error && <div className="text-red">{error}</div>}
        <div className="flex gap-3">
          <button type="submit" className="button-main">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-line rounded-lg hover:bg-surface"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditOrderPage

