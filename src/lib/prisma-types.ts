import {
  Product,
  ProductVariation,
  ProductAttribute,
  ProductSize,
  Order,
  OrderItem,
  User,
} from '@prisma/client'

/**
 * Product with all relations included
 */
export type ProductWithRelations = Product & {
  variations: ProductVariation[]
  attributes: ProductAttribute | null
  sizes: ProductSize[]
}

/**
 * Order with items and user relations
 */
export type OrderWithRelations = Order & {
  items: OrderItem[]
  user: User | null
}

/**
 * Order with items only (no user relation)
 */
export type OrderWithItems = Order & {
  items: OrderItem[]
}

/**
 * Serialized product for API responses (with numeric prices)
 */
export interface SerializedProduct extends Omit<Product, 'price' | 'originPrice'> {
  price: number
  originPrice: number
}

/**
 * Serialized product with relations
 */
export interface SerializedProductWithRelations extends SerializedProduct {
  variations: ProductVariation[]
  attributes: ProductAttribute | null
  sizes: ProductSize[]
}

/**
 * Serialized order item (with numeric price)
 */
export interface SerializedOrderItem extends Omit<OrderItem, 'price'> {
  price: number
}

/**
 * Serialized order for API responses (with numeric totalAmount and items)
 */
export interface SerializedOrder extends Omit<Order, 'totalAmount' | 'discountAmount'> {
  totalAmount: number
  discountAmount: number | null
  items: SerializedOrderItem[]
}

/**
 * Serialized order with user relation
 */
export interface SerializedOrderWithRelations extends SerializedOrder {
  user: User | null
}

