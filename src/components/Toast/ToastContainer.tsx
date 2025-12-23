'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useToast } from '@/context/ToastContext'
import Toast from './Toast'

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything on server or before mount to prevent hydration mismatch
  if (!mounted || typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className="toast-container fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>,
    document.body
  )
}

export default ToastContainer

