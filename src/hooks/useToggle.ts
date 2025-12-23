import { useState, useCallback } from 'react'

export function useToggle(initialValue = false): [boolean, () => void, () => void, () => void] {
  const [isOpen, setIsOpen] = useState(initialValue)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return [isOpen, toggle, open, close]
}

