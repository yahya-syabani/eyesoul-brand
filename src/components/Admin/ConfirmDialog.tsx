'use client'

import React from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-red text-white hover:bg-red/90',
    warning: 'bg-yellow text-white hover:bg-yellow/90',
    info: 'bg-black text-white hover:bg-black/90',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-2 rounded-full ${
              variant === 'danger'
                ? 'bg-red/10'
                : variant === 'warning'
                ? 'bg-yellow/10'
                : 'bg-black/10'
            }`}
          >
            {variant === 'danger' ? (
              <Icon.Warning size={24} className="text-red" />
            ) : variant === 'warning' ? (
              <Icon.Warning size={24} className="text-yellow" />
            ) : (
              <Icon.Info size={24} className="text-black" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="heading6 mb-2">{title}</h3>
            <p className="text-secondary">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-line rounded-lg text-title hover:bg-surface transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-title transition-colors ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

