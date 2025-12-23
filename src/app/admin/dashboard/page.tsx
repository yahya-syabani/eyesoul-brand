import React from 'react'

const fetchJSON = async (path: string) => {
  const res = await fetch(path, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

const DashboardPage = async () => {
  const productsData = await fetchJSON(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/products?limit=5`) || { data: [] }
  const ordersData = await fetchJSON(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/orders?limit=5`) || { data: [] }

  return (
    <div className="container py-10">
      <h1 className="heading3 mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 border border-line rounded-lg bg-white">
          <div className="text-title text-secondary">Products</div>
          <div className="heading4">{productsData.data?.length ?? 0}</div>
          <p className="caption1 text-secondary mt-1">Showing latest items</p>
        </div>
        <div className="p-4 border border-line rounded-lg bg-white">
          <div className="text-title text-secondary">Orders</div>
          <div className="heading4">{ordersData.data?.length ?? 0}</div>
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
            {(productsData.data ?? []).map((product: any) => (
              <div key={product.id} className="px-4 py-3">
                <div className="text-title">{product.name}</div>
                <div className="caption1 text-secondary">{product.category} · ${Number(product.price).toFixed(2)}</div>
              </div>
            ))}
            {(productsData.data ?? []).length === 0 && (
              <div className="px-4 py-6 text-secondary">No products available.</div>
            )}
          </div>
        </div>
        <div className="border border-line rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between">
            <div className="heading6">Recent Orders</div>
          </div>
          <div className="divide-y divide-line">
            {(ordersData.data ?? []).map((order: any) => (
              <div key={order.id} className="px-4 py-3">
                <div className="text-title">Order {order.id.slice(0, 6)}...</div>
                <div className="caption1 text-secondary">Status: {order.status} · ${Number(order.totalAmount).toFixed(2)}</div>
              </div>
            ))}
            {(ordersData.data ?? []).length === 0 && (
              <div className="px-4 py-6 text-secondary">No orders available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

