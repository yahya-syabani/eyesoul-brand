'use client'

type PostHogCaptureProps = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    posthog?: {
      capture?: (event: string, properties?: PostHogCaptureProps) => void
    }
  }
}

export function capturePosthogEvent(event: string, properties?: PostHogCaptureProps): void {
  if (typeof window === 'undefined') return
  window.posthog?.capture?.(event, properties)
}
