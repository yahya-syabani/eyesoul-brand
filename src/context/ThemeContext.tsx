'use client'

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { Theme } from '@/types'

interface ThemeContextProps {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

const THEME_STORAGE_KEY = 'eyesoul_theme'
const THEME_ATTRIBUTE = 'data-theme'

const getStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  // Migrate old 'system' theme to 'light' or 'dark' based on system preference
  if (stored === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const migratedTheme = systemPrefersDark ? 'dark' : 'light'
    window.localStorage.setItem(THEME_STORAGE_KEY, migratedTheme)
    return migratedTheme
  }
  if (stored === 'light' || stored === 'dark') {
    return stored as Theme
  }
  return null
}

const getInitialTheme = (): Theme => {
  // Always start with 'light' on server to match initial client render
  // This prevents hydration mismatch. We'll sync the actual stored theme after mount.
  return 'light'
}

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  return theme
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => resolveTheme(getInitialTheme()))

  // Sync stored theme after mount to avoid hydration mismatch
  useEffect(() => {
    const stored = getStoredTheme()
    if (stored) {
      setThemeState(stored)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    root.setAttribute(THEME_ATTRIBUTE, theme)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

