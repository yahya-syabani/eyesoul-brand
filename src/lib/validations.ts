import { z } from 'zod'

// Login validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Register validation
export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

// Checkout validation
export const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please enter a valid phone number'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  note: z.string().optional(),
  paymentMethod: z.enum(['credit-card', 'cash-delivery', 'apple-pay', 'paypal'], {
    required_error: 'Please select a payment method',
  }),
  cardNumber: z.string().optional(),
  cardDate: z.string().optional(),
  cardCCV: z.string().optional(),
  saveCard: z.boolean().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

// Newsletter validation
export const newsletterSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>

// Forgot password validation
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// User validation
export const userSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['ADMIN', 'CUSTOMER']).default('CUSTOMER'),
})

export const updateUserSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .optional(),
  role: z.enum(['ADMIN', 'CUSTOMER']).optional(),
})

export type UserFormData = z.infer<typeof userSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>

// Order validation
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  price: z.number().positive('Price must be positive'),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
})

export const orderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  shippingAddress: z.record(z.string(), z.unknown()).optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required').optional(),
  userId: z.string().optional(),
})

export type OrderFormData = z.infer<typeof orderSchema>
export type OrderItemFormData = z.infer<typeof orderItemSchema>

