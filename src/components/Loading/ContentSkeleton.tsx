import React from 'react'

interface ContentSkeletonProps {
  variant?: 'text' | 'card' | 'list' | 'form'
  lines?: number
  className?: string
}

export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-line rounded animate-pulse ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  )
}

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-surface rounded-2xl p-6 ${className}`}>
      <div className="h-6 w-3/4 bg-line rounded animate-pulse mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-line rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-line rounded animate-pulse" />
        <div className="h-4 w-4/6 bg-line rounded animate-pulse" />
      </div>
    </div>
  )
}

export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({
  items = 5,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-12 h-12 bg-line rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-line rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-line rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const FormSkeleton: React.FC<{ fields?: number; className?: string }> = ({
  fields = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-line rounded animate-pulse" />
          <div className="h-12 w-full bg-line rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  )
}

const ContentSkeleton: React.FC<ContentSkeletonProps> = ({
  variant = 'text',
  lines = 3,
  className = '',
}) => {
  switch (variant) {
    case 'card':
      return <CardSkeleton className={className} />
    case 'list':
      return <ListSkeleton className={className} />
    case 'form':
      return <FormSkeleton className={className} />
    case 'text':
    default:
      return <TextSkeleton lines={lines} className={className} />
  }
}

export default ContentSkeleton

