import { NextRequest, NextResponse } from 'next/server'
import { saveUploadedFile, validateImageUrl, EntityType } from '@/lib/image-upload'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimit = await rateLimitApi(request)
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt)
  }

  // Authentication check
  const authResult = await requireAdminAuth(request)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const entityType = formData.get('entityType') as EntityType | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!entityType) {
      return NextResponse.json({ error: 'Entity type is required' }, { status: 400 })
    }

    // Validate entity type
    const validEntityTypes: EntityType[] = [
      'products',
      'store-locations',
      'hero-slides',
      'blogs',
      'testimonials',
      'services',
    ]
    if (!validEntityTypes.includes(entityType)) {
      return NextResponse.json(
        { error: `Invalid entity type. Must be one of: ${validEntityTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Save file
    const result = await saveUploadedFile(file, entityType)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

// Validate URL endpoint (for URL input mode)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  const validation = validateImageUrl(url)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  return NextResponse.json({ valid: true, url })
}

