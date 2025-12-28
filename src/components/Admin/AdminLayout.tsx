'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useTheme } from '@/context/ThemeContext'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

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
    { href: '/admin/tags', label: 'Tags', icon: Icon.Tag },
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
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-surface border-r border-line flex flex-col">
        <div className="p-6 border-b border-line flex-shrink-0">
          <h1 className="heading4">Eyesoul Admin</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-secondary hover:bg-surface dark:hover:bg-surface1'
                }`}
              >
                <IconComponent size={20} weight={active ? 'fill' : 'regular'} />
                <span className="text-title">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="flex-shrink-0 border-t border-line p-4 space-y-2">
          <button
            onClick={() => {
              const newTheme = theme === 'light' ? 'dark' : 'light'
              setTheme(newTheme)
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface dark:hover:bg-surface1 w-full transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <Icon.Moon size={20} />
            ) : (
              <Icon.Sun size={20} />
            )}
            <span className="text-title">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface dark:hover:bg-surface1 w-full transition-colors"
          >
            <Icon.SignOut size={20} />
            <span className="text-title">Logout</span>
          </button>
        </div>
      </aside>
      <main className="ml-64 bg-surface dark:bg-surface">
        <div className="container py-10">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout

