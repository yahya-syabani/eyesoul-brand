'use client'

import { DependencyList, useEffect } from 'react'

export function useDebouncedEffect(effect: () => void, deps: DependencyList, delayMs: number) {
  useEffect(() => {
    const id = window.setTimeout(() => effect(), delayMs)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delayMs])
}


