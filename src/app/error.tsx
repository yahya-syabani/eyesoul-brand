'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { reportError } from '@/lib/reportError'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportError(error, { source: 'app/error.tsx', digest: error.digest })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
        <div className="heading3 mb-4">Something went wrong</div>
        <p className="body1 text-secondary mb-6">
          We couldn’t load this page. Please try again, or go back to the homepage.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-6 p-4 bg-surface rounded-lg">
            <summary className="caption1 font-semibold mb-2 cursor-pointer">Error Details (Development Only)</summary>
            <pre className="caption2 text-red overflow-auto">{error.message}</pre>
          </details>
        )}
        <div className="flex gap-4 justify-center">
          <button onClick={() => reset()} className="button-main" type="button">
            Try Again
          </button>
          <Link href="/" className="button-main bg-white border border-black text-black hover:bg-black hover:text-white">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}


