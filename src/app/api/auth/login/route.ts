import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authCookieName, signToken, verifyPassword } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email })

    const response = NextResponse.json({ message: 'Logged in', user: { id: user.id, email: user.email, role: user.role } })
    response.cookies.set(authCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', issues: error.issues }, { status: 400 })
    }
    return NextResponse.json({ message: 'Login failed' }, { status: 500 })
  }
}

