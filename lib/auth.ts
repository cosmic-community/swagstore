import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { User } from '@/types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long'
)

export interface SessionData {
  userId: string
  email: string
  name: string
}

// Create JWT token
export async function createToken(user: User): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.metadata.email,
    name: user.metadata.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)

  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionData
  } catch (error) {
    return null
  }
}

// Get current session from cookies
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    return null
  }

  return verifyToken(token.value)
}

// Set session cookie
export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

// Clear session cookie
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// Hash password (simple implementation - in production use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  // Using Web Crypto API for password hashing
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}