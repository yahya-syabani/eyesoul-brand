'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import DataTable from '@/components/Admin/DataTable'
import ConfirmDialog from '@/components/Admin/ConfirmDialog'
import * as Icon from '@phosphor-icons/react/dist/ssr'

interface User {
  id: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  ordersCount: number
  createdAt: string
  updatedAt: string
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  })
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUsers()
  }, [roleFilter, search])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (search) params.append('search', search)
      const res = await fetch(`/api/users?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const json = await res.json()
        setUsers(json.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.user) return
    try {
      const res = await fetch(`/api/users/${deleteDialog.user.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        loadUsers()
        setDeleteDialog({ isOpen: false, user: null })
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const columns = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            value === 'ADMIN' ? 'bg-red/10 text-red' : 'bg-blue/10 text-blue'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'ordersCount',
      label: 'Orders',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="heading4">Users</h1>
          <Link href="/admin/users/new" className="button-main">
            New User
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email..."
              className="w-full border border-line rounded px-3 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-line rounded px-3 py-2"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>

        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          actions={(user) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/users/${user.id}/edit`}
                className="text-blue hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialog({ isOpen: true, user })
                }}
                className="text-red hover:underline"
              >
                Delete
              </button>
            </div>
          )}
          emptyMessage="No users found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete user ${deleteDialog.user?.email}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, user: null })}
        variant="danger"
      />
    </>
  )
}

export default AdminUsersPage
