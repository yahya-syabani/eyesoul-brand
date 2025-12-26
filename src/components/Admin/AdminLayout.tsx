'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import * as Icon from '@phosphor-icons/react/dist/ssr'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Icon.House },
    { href: '/admin/products', label: 'Products', icon: Icon.Package },
    { href: '/admin/orders', label: 'Orders', icon: Icon.ShoppingBag },
    { href: '/admin/users', label: 'Users', icon: Icon.Users },
    { href: '/admin/promotions', label: 'Promotions', icon: Icon.Ticket },
    { href: '/admin/blogs', label: 'Blogs', icon: Icon.Article },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Icon.Star },
    { href: '/admin/store-locations', label: 'Store Locations', icon: Icon.MapPin },
    { href: '/admin/hero-slides', label: 'Hero Slides', icon: Icon.ImageSquare },
    { href: '/admin/inventory', label: 'Inventory', icon: Icon.Archive },
  ]

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-line">
        <div className="p-6 border-b border-line">
          <h1 className="heading4">Eyesoul Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-black text-white'
                    : 'text-secondary hover:bg-surface'
                }`}
              >
                <IconComponent size={20} weight={active ? 'fill' : 'regular'} />
                <span className="text-title">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-line">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface w-full transition-colors"
          >
            <Icon.SignOut size={20} />
            <span className="text-title">Logout</span>
          </button>
        </div>
      </aside>
      <main className="ml-64">
        <div className="container py-10">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout

