// Eyewear Categories
export const PRODUCT_CATEGORIES = [
  'sunglasses',
  'prescription-glasses',
  'reading-glasses',
  'contact-lenses',
  'frames-only',
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

// Frame Size labels for eyewear
export const PRODUCT_SIZES = ['small', 'medium', 'large', 'extra-wide'] as const

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

// Brands (custom eyewear)
export const BRANDS = ['eyesoul', 'clarity', 'visionary', 'suncrest', 'lumina'] as const

export type Brand = typeof BRANDS[number]

// Eyewear-specific attributes
export const LENS_TYPES = ['single-vision', 'progressive', 'bifocal', 'trifocal'] as const
export const FRAME_MATERIALS = ['acetate', 'metal', 'titanium', 'tr90', 'wood'] as const
export const LENS_COATINGS = ['anti-reflective', 'blue-light', 'uv-protection', 'scratch-resistant'] as const

export type LensType = typeof LENS_TYPES[number]
export type FrameMaterial = typeof FRAME_MATERIALS[number]
export type LensCoating = typeof LENS_COATINGS[number]

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

