import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { handleApiError } from '@/lib/api-error-handler'
import { requireAdminAuth } from '@/lib/api-auth'
import { rateLimitApi, createRateLimitResponse } from '@/lib/rate-limit'

const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tag: z.string().optional().nullable(),
  author: z.string().min(1).optional(),
  avatar: z.string().optional().nullable(),
  thumbImg: z.string().optional().nullable(),
  coverImg: z.string().optional().nullable(),
  subImg: z.array(z.string()).optional(),
  shortDesc: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const bySlug = searchParams.get('slug') === 'true'

    const blog = bySlug
      ? await prisma.blog.findUnique({
          where: { slug: id },
        })
      : await prisma.blog.findUnique({
          where: { id },
        })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimit = rateLimitApi(request)
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
    const payload = updateBlogSchema.parse(await request.json())

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        ...(payload.title && { title: payload.title }),
        ...(payload.slug && { slug: payload.slug }),
        ...(payload.category && { category: payload.category }),
        ...(payload.tag !== undefined && { tag: payload.tag }),
        ...(payload.author && { author: payload.author }),
        ...(payload.avatar !== undefined && { avatar: payload.avatar }),
        ...(payload.thumbImg !== undefined && { thumbImg: payload.thumbImg }),
        ...(payload.coverImg !== undefined && { coverImg: payload.coverImg }),
        ...(payload.subImg !== undefined && { subImg: payload.subImg }),
        ...(payload.shortDesc && { shortDesc: payload.shortDesc }),
        ...(payload.description && { description: payload.description }),
        ...(payload.date && { date: payload.date }),
      },
    })

    return NextResponse.json(updated)
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
    await prisma.blog.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

