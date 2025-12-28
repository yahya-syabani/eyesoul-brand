'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { EntityType } from '@/lib/image-upload'

interface ImageUploadFieldProps {
  label: string
  value: string | string[]
  onChange: (value: string | string[]) => void
  entityType: EntityType
  multiple?: boolean
  required?: boolean
  error?: string
  aspectRatio?: string // e.g., "16/9", "1/1"
  maxImages?: number
  className?: string
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  entityType,
  multiple = false,
  required = false,
  error,
  aspectRatio,
  maxImages,
  className,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const images = Array.isArray(value) ? value : value ? [value] : []
  const hasImages = images.length > 0

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const filesArray = Array.from(files)
      const totalImages = images.length + filesArray.length

      if (maxImages && totalImages > maxImages) {
        setUploadError(`Maximum ${maxImages} image(s) allowed`)
        return
      }

      setUploading(true)
      setUploadError(null)

      try {
        const uploadPromises = filesArray.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('entityType', entityType)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Upload failed')
          }

          const result = await response.json()
          return result.url
        })

        const uploadedUrls = await Promise.all(uploadPromises)

        if (multiple) {
          onChange([...images, ...uploadedUrls])
        } else {
          onChange(uploadedUrls[0])
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Failed to upload image(s)')
      } finally {
        setUploading(false)
      }
    },
    [entityType, images, multiple, maxImages, onChange]
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      dragCounter.current = 0

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files)
      }
    },
    [handleFileSelect]
  )

  const handleRemoveImage = (index: number) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index)
      onChange(newImages)
    } else {
      onChange('')
    }
  }

  const handleUrlSubmit = async (url: string) => {
    if (!url.trim()) {
      if (required) {
        setUploadError('Image URL is required')
      } else {
        onChange(multiple ? [] : '')
      }
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Invalid URL')
      }

      const result = await response.json()
      if (multiple) {
        onChange([...images, result.url])
      } else {
        onChange(result.url)
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid image URL')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <label className="text-title">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-3 py-1 text-sm rounded ${
              mode === 'upload'
                ? 'bg-black text-white'
                : 'bg-surface text-secondary hover:bg-line'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1 text-sm rounded ${
              mode === 'url'
                ? 'bg-black text-white'
                : 'bg-surface text-secondary hover:bg-line'
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-black bg-black/5'
              : error || uploadError
              ? 'border-red bg-red/5'
              : 'border-line hover:border-black/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={multiple}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin">
                <Icon.CircleNotch size={24} />
              </div>
              <p className="text-sm text-secondary">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Icon.Upload size={32} className="text-secondary2" />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-button text-black hover:underline"
                >
                  Click to upload
                </button>
                <span className="text-secondary2"> or drag and drop</span>
              </div>
              <p className="text-xs text-secondary2">
                PNG, JPG, WEBP up to 10MB
                {maxImages && ` (max ${maxImages} image${maxImages > 1 ? 's' : ''})`}
              </p>
            </div>
          )}
        </div>
      ) : (
        <UrlInputMode
          onSubmit={handleUrlSubmit}
          loading={uploading}
          placeholder="Enter image URL (http://, https://, or /path/to/image)"
        />
      )}

      {(error || uploadError) && (
        <div className="text-red text-sm">{error || uploadError}</div>
      )}

      {hasImages && (
        <div className="space-y-3">
          <div
            className={`grid gap-3 ${
              multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
            }`}
          >
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className={`relative group border border-line rounded-lg overflow-hidden ${
                  aspectRatio ? `aspect-${aspectRatio.replace('/', '-')}` : 'aspect-square'
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <Icon.X size={14} />
                </button>
              </div>
            ))}
          </div>
          {multiple && maxImages && images.length >= maxImages && (
            <p className="text-xs text-secondary2">Maximum images reached</p>
          )}
        </div>
      )}
    </div>
  )
}

interface UrlInputModeProps {
  onSubmit: (url: string) => void
  loading: boolean
  placeholder?: string
}

const UrlInputMode: React.FC<UrlInputModeProps> = ({ onSubmit, loading, placeholder }) => {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(url)
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border border-line rounded px-3 py-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-4 py-2 bg-black text-white rounded hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin">
              <Icon.CircleNotch size={16} />
            </div>
          ) : (
            'Add'
          )}
        </button>
      </div>
    </form>
  )
}

