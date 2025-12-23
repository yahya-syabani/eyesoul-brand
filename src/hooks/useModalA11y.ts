'use client'

import { RefObject, useEffect, useRef } from 'react'

type Params<T extends HTMLElement> = {
  isOpen: boolean
  onClose: () => void
  containerRef: RefObject<T | null>
  initialFocusRef?: RefObject<HTMLElement | null>
  trapFocus?: boolean
  restoreFocus?: boolean
}

const getFocusable = (root: HTMLElement) => {
  const selector =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    const style = window.getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden'
  })
}

export function useModalA11y<T extends HTMLElement>({
  isOpen,
  onClose,
  containerRef,
  initialFocusRef,
  trapFocus = true,
  restoreFocus = true,
}: Params<T>) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusTarget = initialFocusRef?.current || containerRef.current
    requestAnimationFrame(() => focusTarget?.focus())

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (!trapFocus || e.key !== 'Tab') return

      const root = containerRef.current
      if (!root) return

      const focusables = getFocusable(root)
      if (focusables.length === 0) {
        e.preventDefault()
        root.focus()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (!active || active === first || !root.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)

      if (restoreFocus && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [containerRef, initialFocusRef, isOpen, onClose, restoreFocus, trapFocus])
}


