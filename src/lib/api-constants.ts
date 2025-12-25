/**
 * API Constants
 * Centralized constants for API routes, storage keys, and configuration values
 */

// Storage Keys
export const CART_STORAGE_KEY = 'eyesoul_cart_v1'

// Cookie Configuration
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

// API Route Paths
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  PRODUCTS: {
    BASE: '/api/products',
    SEARCH: '/api/products/search',
  },
  ORDERS: {
    BASE: '/api/orders',
  },
} as const

// Error Messages (generic, non-sensitive)
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  LOGIN_FAILED: 'Login failed',
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found',
  USER_NOT_FOUND: 'User not found',
  VARIATION_NOT_FOUND: 'Variation not found',
  SIZE_NOT_FOUND: 'Size not found',
  FAILED_TO_CREATE: 'Failed to create resource',
  FAILED_TO_UPDATE: 'Failed to update resource',
  FAILED_TO_DELETE: 'Failed to delete resource',
  EMAIL_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_EMAIL: 'Invalid email address',
  WEAK_PASSWORD: 'Password does not meet requirements',
  INVALID_ROLE: 'Invalid role specified',
  INVALID_ORDER_STATUS: 'Invalid order status',
  EMPTY_ORDER_ITEMS: 'Order must have at least one item',
} as const

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  LOGIN: {
    LIMIT: 5,
    WINDOW: 15 * 60, // 15 minutes in seconds
  },
  API: {
    LIMIT: 100,
    WINDOW: 60, // 1 minute in seconds
  },
  SEARCH: {
    LIMIT: 50,
    WINDOW: 60, // 1 minute in seconds
  },
} as const

