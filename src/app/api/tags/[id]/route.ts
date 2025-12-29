import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

// Helper function to generate URL-friendly slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

const updateTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      blogCount: tag._count.blogs,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params
    const payload = updateTagSchema.parse(await request.json())

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    })

    if (!existingTag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: { name?: string; slug?: string } = {}

    // If name is provided, update it and optionally regenerate slug
    if (payload.name !== undefined) {
      updateData.name = payload.name.trim()
      
      // If slug is not explicitly provided, regenerate from name
      if (payload.slug === undefined) {
        updateData.slug = generateSlug(updateData.name)
      }
    }

    // If slug is explicitly provided, use it
    if (payload.slug !== undefined) {
      updateData.slug = payload.slug.trim()
    }

    // Check for conflicts if name or slug is being changed
    if (updateData.name && updateData.name !== existingTag.name) {
      const nameConflict = await prisma.tag.findUnique({
        where: { name: updateData.name },
      })
      if (nameConflict && nameConflict.id !== id) {
        return NextResponse.json(
          { error: 'A tag with this name already exists' },
          { status: 400 }
        )
      }
    }

    if (updateData.slug && updateData.slug !== existingTag.slug) {
      const slugConflict = await prisma.tag.findUnique({
        where: { slug: updateData.slug },
      })
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { error: 'A tag with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.tag.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      blogCount: updated._count.blogs,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authentication check
  const authResult = await requireAdminAuth(_)
  if ('error' in authResult) {
    return authResult.error
  }

  try {
    const { id } = await params

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Check if tag has associated blogs
    if (tag._count.blogs > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete tag. It is associated with ${tag._count.blogs} blog(s). Please remove the tag from all blogs first.`,
        },
        { status: 400 }
      )
    }

    // Delete the tag (cascade will handle BlogTag relations)
    await prisma.tag.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

