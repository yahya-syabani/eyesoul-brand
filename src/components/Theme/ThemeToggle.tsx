'use client'

import React, { useState, useEffect } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useTheme } from '@/context/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const getIcon = () => {
    if (resolvedTheme === 'dark') {
      return <Icon.Moon size={20} weight="fill" />
    }
    return <Icon.Sun size={20} weight="fill" />
  }

  const getLabel = () => {
    if (!mounted) {
      // During SSR, return a static label to avoid hydration mismatch
      return theme === 'dark' ? 'Dark' : 'Light'
    }
    return theme === 'dark' ? 'Dark' : 'Light'
  }

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle flex items-center justify-center w-10 h-10 rounded-full bg-surface hover:bg-black hover:text-white duration-300 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      type="button"
      title={getLabel()}
    >
      {getIcon()}
    </button>
  )
}

export default ThemeToggle

