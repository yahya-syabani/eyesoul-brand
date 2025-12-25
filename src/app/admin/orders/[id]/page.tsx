'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { SerializedOrderWithRelations } from '@/lib/prisma-types'

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [order, setOrder] = useState<SerializedOrderWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
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

  if (loading) {
    return <div className="text-secondary">Loading order...</div>
  }

  if (error || !order) {
    return <div className="text-red">{error || 'Order not found'}</div>
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading4">Order Details</h1>
        <Link href={`/admin/orders/${id}/edit`} className="button-main">
          Edit Order
        </Link>
      </div>

      <div className="border border-line rounded-lg p-6 space-y-4">
        <h2 className="heading6">Order Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-title text-secondary mb-1">Order ID</div>
            <div className="text-title">{order.id}</div>
          </div>
          <div>
            <div className="text-title text-secondary mb-1">Status</div>
            <div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  order.status === 'DELIVERED'
                    ? 'bg-green/10 text-green'
                    : order.status === 'CANCELLED'
                    ? 'bg-red/10 text-red'
                    : order.status === 'SHIPPED'
                    ? 'bg-blue/10 text-blue'
                    : 'bg-yellow/10 text-yellow'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
          <div>
            <div className="text-title text-secondary mb-1">Total Amount</div>
            <div className="text-title">${Number(order.totalAmount).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-title text-secondary mb-1">Created</div>
            <div className="text-title">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          {order.user && (
            <div>
              <div className="text-title text-secondary mb-1">User</div>
              <div className="text-title">{order.user.email} ({order.user.role})</div>
            </div>
          )}
        </div>
      </div>

      <div className="border border-line rounded-lg p-6 space-y-4">
        <h2 className="heading6">Shipping Address</h2>
        <div className="text-title">
          {order.shippingAddress && typeof order.shippingAddress === 'object' ? (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(order.shippingAddress, null, 2)}
            </pre>
          ) : (
            String(order.shippingAddress)
          )}
        </div>
      </div>

      <div className="border border-line rounded-lg p-6 space-y-4">
        <h2 className="heading6">Order Items</h2>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item.id} className="border border-line rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-title">Product ID: {item.productId}</div>
                  <div className="text-secondary text-sm">
                    Quantity: {item.quantity} × ${Number(item.price).toFixed(2)} = ${(item.quantity * Number(item.price)).toFixed(2)}
                  </div>
                  {item.selectedSize && (
                    <div className="text-secondary text-sm">Size: {item.selectedSize}</div>
                  )}
                  {item.selectedColor && (
                    <div className="text-secondary text-sm">Color: {item.selectedColor}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-line rounded-lg hover:bg-surface"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default OrderDetailPage

