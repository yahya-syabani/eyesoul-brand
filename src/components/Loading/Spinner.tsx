import React from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text, className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-line border-t-black rounded-full animate-spin`}
        role="status"
        aria-label={text || 'Loading'}
      >
        <span className="sr-only">{text || 'Loading...'}</span>
      </div>
      {text && <p className="caption1 text-secondary">{text}</p>}
    </div>
  )
}

export default Spinner

