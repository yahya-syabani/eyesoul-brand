import React from 'react'
import Spinner from './Spinner'

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Spinner size="lg" text="Loading page..." />
    </div>
  )
}

export default PageLoader

