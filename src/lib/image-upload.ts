import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export type EntityType = 'products' | 'store-locations' | 'hero-slides' | 'blogs' | 'testimonials' | 'services'

export interface ImageUploadResult {
  url: string
  filename: string
}

export interface ImageValidationResult {
  valid: boolean
  error?: string
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Validate image file
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  return { valid: true }
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const ext = originalFilename.split('.').pop() || 'png'
  return `${timestamp}-${random}.${ext}`
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_')
}

/**
 * Get upload directory path for entity type
 */
export function getUploadDir(entityType: EntityType): string {
  return join(process.cwd(), 'public', 'uploads', entityType)
}

/**
 * Get public URL path for uploaded image
 */
export function getPublicImageUrl(entityType: EntityType, filename: string): string {
  return `/uploads/${entityType}/${filename}`
}

/**
 * Save uploaded file to disk
 */
export async function saveUploadedFile(
  file: File,
  entityType: EntityType
): Promise<ImageUploadResult> {
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Generate unique filename
  const sanitizedOriginal = sanitizeFilename(file.name)
  const filename = generateUniqueFilename(sanitizedOriginal)

  // Get upload directory
  const uploadDir = getUploadDir(entityType)

  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Convert File to Buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Save file
  const filePath = join(uploadDir, filename)
  await writeFile(filePath, buffer)

  // Return public URL
  const url = getPublicImageUrl(entityType, filename)

  return { url, filename }
}

/**
 * Validate image URL
 */
export function validateImageUrl(url: string): ImageValidationResult {
  try {
    const urlObj = new URL(url)
    // Allow http, https, and relative paths starting with /
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return { valid: true }
    }
    if (url.startsWith('/')) {
      return { valid: true }
    }
    return {
      valid: false,
      error: 'Invalid URL format. Must be http://, https://, or start with /',
    }
  } catch {
    // If URL parsing fails, check if it's a relative path
    if (url.startsWith('/')) {
      return { valid: true }
    }
    return {
      valid: false,
      error: 'Invalid URL format',
    }
  }
}

