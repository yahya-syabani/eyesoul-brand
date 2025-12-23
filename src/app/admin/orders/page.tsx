'use client'

import React, { useEffect, useState } from 'react'

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/orders?limit=100', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          setOrders(json.data || [])
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
      <h1 className="heading4">Orders</h1>
      {loading ? (
        <div className="text-secondary">Loading orders...</div>
      ) : (
        <div className="border border-line rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 bg-surface px-4 py-2 text-title text-secondary">
            <div>ID</div>
            <div>Status</div>
            <div>Total</div>
            <div>Items</div>
            <div>Date</div>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="grid grid-cols-5 px-4 py-3 border-t border-line">
              <div className="caption1 text-secondary">{order.id.slice(0, 8)}...</div>
              <div className="caption1 text-secondary">{order.status}</div>
              <div className="caption1 text-secondary">${Number(order.totalAmount).toFixed(2)}</div>
              <div className="caption1 text-secondary">{order.items?.length ?? 0}</div>
              <div className="caption1 text-secondary">{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {orders.length === 0 && <div className="px-4 py-6 text-secondary">No orders found.</div>}
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage

