'use client'

import React, { useEffect } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { Toast as ToastType } from '@/context/ToastContext'

interface ToastProps {
  toast: ToastType
  onRemove: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id, onRemove])

  const getIcon = () => {
    switch (toast.variant) {
      case 'success':
        return <Icon.CheckCircle weight="fill" size={20} />
      case 'error':
        return <Icon.XCircle weight="fill" size={20} />
      case 'warning':
        return <Icon.Warning weight="fill" size={20} />
      case 'info':
      default:
        return <Icon.Info weight="fill" size={20} />
    }
  }

  const getVariantStyles = () => {
    switch (toast.variant) {
      case 'success':
        return 'bg-success text-white border-success'
      case 'error':
        return 'bg-red text-white border-red'
      case 'warning':
        return 'bg-yellow text-black border-yellow'
      case 'info':
      default:
        return 'bg-purple text-white border-purple'
    }
  }

  return (
    <div
      className={`toast flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-[500px] ${getVariantStyles()} animate-in slide-in-from-right-full`}
      role="alert"
      aria-live={toast.variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 caption1">{toast.message}</div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
        type="button"
      >
        <Icon.X size={16} weight="bold" />
      </button>
    </div>
  )
}

export default Toast

