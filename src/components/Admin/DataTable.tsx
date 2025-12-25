'use client'

import React, { useState } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  onRowClick?: (row: T) => void
  actions?: (row: T) => React.ReactNode
  emptyMessage?: string
}

function DataTable<T extends { id: string }>({
  data,
  columns,
  loading = false,
  onRowClick,
  actions,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aValue = a[sortKey as keyof T]
    const bValue = b[sortKey as keyof T]
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  if (loading) {
    return (
      <div className="border border-line rounded-lg p-8 text-center text-secondary">
        Loading...
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="border border-line rounded-lg p-8 text-center text-secondary">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="border border-line rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-title text-secondary"
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="hover:text-black transition-colors"
                      >
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <Icon.CaretUp size={16} />
                          ) : (
                            <Icon.CaretDown size={16} />
                          )
                        ) : (
                          <Icon.CaretUpDown size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-left text-title text-secondary">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className={`border-t border-line ${
                  onRowClick ? 'cursor-pointer hover:bg-surface' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3">
                    {column.render
                      ? column.render(row[column.key as keyof T], row)
                      : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
                {actions && (
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable

