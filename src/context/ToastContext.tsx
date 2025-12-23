'use client'

import React, { createContext, useContext, useCallback, useState, useMemo } from 'react'
import { ToastVariant } from '@/types'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

interface ToastContextProps {
  toasts: Toast[]
  addToast: (message: string, variant?: ToastVariant, duration?: number) => string
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => string
  error: (message: string, duration?: number) => string
  info: (message: string, duration?: number) => string
  warning: (message: string, duration?: number) => string
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

const DEFAULT_DURATION = 3000

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration: number = DEFAULT_DURATION): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const toast: Toast = { id, message, variant, duration }

      setToasts((prev) => [...prev, toast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    [removeToast]
  )

  const success = useCallback(
    (message: string, duration?: number) => addToast(message, 'success', duration),
    [addToast]
  )

  const error = useCallback(
    (message: string, duration?: number) => addToast(message, 'error', duration),
    [addToast]
  )

  const info = useCallback(
    (message: string, duration?: number) => addToast(message, 'info', duration),
    [addToast]
  )

  const warning = useCallback(
    (message: string, duration?: number) => addToast(message, 'warning', duration),
    [addToast]
  )

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      success,
      error,
      info,
      warning,
    }),
    [toasts, addToast, removeToast, success, error, info, warning]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

