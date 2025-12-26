'use client'

import React from 'react'
import { Link } from '@/i18n/routing'

const SkipLink: React.FC = () => {
  return (
    <Link
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
    >
      Skip to main content
    </Link>
  )
}

export default SkipLink

