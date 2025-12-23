// Product Types
export const PRODUCT_TYPES = [
  't-shirt',
  'dress',
  'top',
  'swimwear',
  'shirt',
  'sweater',
  'outerwear',
  'underwear',
  'sets',
  'accessories',
] as const

export type ProductType = typeof PRODUCT_TYPES[number]

// Product Sizes
export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'freesize'] as const

export type ProductSize = typeof PRODUCT_SIZES[number]

// Product Colors
export const PRODUCT_COLORS = [
  'pink',
  'red',
  'green',
  'yellow',
  'purple',
  'black',
  'white',
] as const

export type ProductColor = typeof PRODUCT_COLORS[number]

// Brands
export const BRANDS = ['adidas', 'hermes', 'zara', 'nike', 'gucci'] as const

export type Brand = typeof BRANDS[number]

// Shipping Constants
export const FREE_SHIPPING_THRESHOLD = 150
export const SHIPPING_COSTS = {
  FREE: 0,
  LOCAL: 30,
  FLAT_RATE: 40,
} as const

// Discount Codes
export const DISCOUNT_CODES = [
  {
    code: 'AN6810',
    minOrder: 200,
    discountPercent: 10,
  },
  {
    code: 'AN6810',
    minOrder: 300,
    discountPercent: 15,
  },
  {
    code: 'AN6810',
    minOrder: 400,
    discountPercent: 20,
  },
] as const

// Compare Limit
export const MAX_COMPARE_PRODUCTS = 3

// Price Range
export const PRICE_RANGE = {
  MIN: 0,
  MAX: 100,
} as const

// Sort Options
export const SORT_OPTIONS = {
  SOLD_HIGH_TO_LOW: 'soldQuantityHighToLow',
  DISCOUNT_HIGH_TO_LOW: 'discountHighToLow',
  PRICE_HIGH_TO_LOW: 'priceHighToLow',
  PRICE_LOW_TO_HIGH: 'priceLowToHigh',
} as const

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS]

// Layout Options
export const LAYOUT_COLUMNS = [3, 4, 5] as const

export type LayoutColumn = typeof LAYOUT_COLUMNS[number]

// Color Codes for UI
export const COLOR_CODES: Record<ProductColor, string> = {
  pink: '#F4C5BF',
  red: '#DB4444',
  green: '#D2EF9A',
  yellow: '#ECB018',
  purple: '#8684D4',
  black: '#1F1F1F',
  white: '#F6EFDD',
} as const

