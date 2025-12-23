import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { PRODUCT_CATEGORIES, PRODUCT_COLORS, PRODUCT_SIZES } from '@/lib/constants'

const variationSchema = z.object({
  color: z.enum(PRODUCT_COLORS).or(z.string()),
  colorCode: z.string().optional(),
  colorImage: z.string().optional(),
  image: z.string(),
})

const frameSizeSchema = z.object({
  bridgeWidth: z.number().optional(),
  templeLength: z.number().optional(),
  lensWidth: z.number().optional(),
}).partial()

const productSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  category: z.enum(PRODUCT_CATEGORIES).or(z.string()).optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  originPrice: z.number().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional(),
  thumbImages: z.array(z.string()).optional(),
  rate: z.number().optional(),
  sold: z.number().optional(),
  quantity: z.number().optional(),
  isNew: z.boolean().optional(),
  isSale: z.boolean().optional(),
  variations: z.array(variationSchema).optional(),
  lensType: z.string().optional(),
  frameMaterial: z.string().optional(),
  frameSize: frameSizeSchema.optional(),
  lensCoating: z.array(z.string()).optional(),
  sizes: z.array(z.enum(PRODUCT_SIZES).or(z.string())).optional(),
})

const serializeProduct = (product: any) => ({
  ...product,
  price: Number(product.price),
  originPrice: Number(product.originPrice),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { variations: true, attributes: true, sizes: true },
  })

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(serializeProduct(product))
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = productSchema.parse(await request.json())

    const existing = await prisma.product.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: payload.name,
        slug: payload.slug,
        category: payload.category,
        type: payload.type,
        description: payload.description,
        price: payload.price,
        originPrice: payload.originPrice,
        brand: payload.brand,
        rate: payload.rate,
        sold: payload.sold,
        quantity: payload.quantity,
        isNew: payload.isNew,
        isSale: payload.isSale,
        images: payload.images,
        thumbImages: payload.thumbImages,
        variations: payload.variations
          ? {
              deleteMany: { productId: params.id },
              create: payload.variations.map((v) => ({
                color: v.color,
                colorCode: v.colorCode,
                colorImage: v.colorImage,
                image: v.image,
              })),
            }
          : undefined,
        attributes: payload.lensType || payload.frameMaterial || payload.frameSize || payload.lensCoating
          ? {
              upsert: {
                create: {
                  lensType: payload.lensType,
                  frameMaterial: payload.frameMaterial,
                  frameSize: payload.frameSize,
                  lensCoating: payload.lensCoating ?? [],
                },
                update: {
                  lensType: payload.lensType,
                  frameMaterial: payload.frameMaterial,
                  frameSize: payload.frameSize,
                  lensCoating: payload.lensCoating ?? [],
                },
              },
            }
          : undefined,
        sizes: payload.sizes
          ? {
              deleteMany: { productId: params.id },
              create: payload.sizes.map((size) => ({ size })),
            }
          : undefined,
      },
      include: { variations: true, attributes: true, sizes: true },
    })

    return NextResponse.json(serializeProduct(updated))
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', issues: error.issues }, { status: 400 })
    }
    return NextResponse.json({ message: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 })
  }
}

