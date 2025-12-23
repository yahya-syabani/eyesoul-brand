'use client'

import React, { useEffect, useRef } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus trap
      const firstFocusable = dialogRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'text-red'
      case 'warning':
        return 'text-yellow'
      case 'info':
      default:
        return 'text-purple'
    }
  }

  const getConfirmButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red hover:bg-red/90 text-white'
      case 'warning':
        return 'bg-yellow hover:bg-yellow/90 text-black'
      case 'info':
      default:
        return 'bg-purple hover:bg-purple/90 text-white'
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 ${getVariantStyles()}`}>
            {variant === 'danger' && <Icon.WarningCircle size={24} weight="fill" />}
            {variant === 'warning' && <Icon.Warning size={24} weight="fill" />}
            {variant === 'info' && <Icon.Info size={24} weight="fill" />}
          </div>
          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="heading5 mb-2">
              {title}
            </h3>
            <p id="confirm-dialog-message" className="body1 text-secondary">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
            aria-label="Close dialog"
            type="button"
          >
            <Icon.X size={16} />
          </button>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="button-main bg-white border border-line text-black hover:bg-surface"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`button-main ${getConfirmButtonStyles()}`}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

