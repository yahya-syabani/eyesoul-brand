import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
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

export const signToken = (payload: AuthTokenPayload) => {
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

