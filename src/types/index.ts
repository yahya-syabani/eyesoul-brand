// Branded types for better type safety
export type ProductId = string & { readonly __brand: 'ProductId' }
export type CartItemId = string & { readonly __brand: 'CartItemId' }
export type WishlistItemId = string & { readonly __brand: 'WishlistItemId' }
export type CompareItemId = string & { readonly __brand: 'CompareItemId' }

// Utility type for making specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Utility type for making specific properties optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

// Async result type
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

// Form field error type
export type FieldError = {
  message: string
  type?: string
}

// Toast variant type
export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

// Theme type
export type Theme = 'light' | 'dark'

