import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { COOKIE_MAX_AGE } from './api-constants'

// Validate JWT_SECRET at startup
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production')
    }
    // Only allow dev-secret in development with warning
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable for production!')
    return 'dev-secret'
  }
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }
  return secret
}

const JWT_SECRET = getJwtSecret()
const TOKEN_EXPIRY = '7d'

export interface AuthTokenPayload {
  userId: string
  role: 'ADMIN' | 'CUSTOMER'
  email: string
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const verifyPassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed)
}

export const signToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
  } catch {
    return null
  }
}

export const authCookieName = 'eyesoul_admin_token'

