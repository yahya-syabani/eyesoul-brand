import React from 'react'
import prisma from '@/lib/prisma'
import { transformProductForFrontend } from '@/utils/transformProduct'
import { ProductType } from '@/type/ProductType'
import { OrderWithRelations } from '@/lib/prisma-types'

const DashboardPage = async () => {
  // Fetch products directly from database
  let products: ProductType[] = []
  try {
    const dbProducts = await prisma.product.findMany({
      take: 5,
      include: { variations: true, attributes: true, sizes: true },
      orderBy: { createdAt: 'desc' },
    })
    products = dbProducts.map(transformProductForFrontend)
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  // Fetch orders directly from database
  let orders: OrderWithRelations[] = []
  try {
    orders = await prisma.order.findMany({
      take: 5,
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
  }

  return (
    <div className="container py-10">
      <h1 className="heading3 mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 border border-line rounded-lg bg-white">
          <div className="text-title text-secondary">Products</div>
          <div className="heading4">{products.length}</div>
          <p className="caption1 text-secondary mt-1">Showing latest items</p>
        </div>
        <div className="p-4 border border-line rounded-lg bg-white">
          <div className="text-title text-secondary">Orders</div>
          <div className="heading4">{orders.length}</div>
          <p className="caption1 text-secondary mt-1">Recent orders</p>
        </div>
        <div className="p-4 border border-line rounded-lg bg-white">
          <div className="text-title text-secondary">Status</div>
          <div className="heading4">Eyewear</div>
          <p className="caption1 text-secondary mt-1">Content migrated</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-line rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between">
            <div className="heading6">Recent Products</div>
          </div>
          <div className="divide-y divide-line">
            {products.map((product) => (
              <div key={product.id} className="px-4 py-3">
                <div className="text-title">{product.name}</div>
                <div className="caption1 text-secondary">{product.category} · ${Number(product.price).toFixed(2)}</div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="px-4 py-6 text-secondary">No products available.</div>
            )}
          </div>
        </div>
        <div className="border border-line rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between">
            <div className="heading6">Recent Orders</div>
          </div>
          <div className="divide-y divide-line">
            {orders.map((order) => (
              <div key={order.id} className="px-4 py-3">
                <div className="text-title">Order {order.id.slice(0, 6)}...</div>
                <div className="caption1 text-secondary">Status: {order.status} · ${Number(order.totalAmount).toFixed(2)}</div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="px-4 py-6 text-secondary">No orders available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

