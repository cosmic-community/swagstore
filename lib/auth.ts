import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { User } from '@/types'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long'
)

export interface SessionData {
  userId: string
  email: string
  name: string
  [key: string]: string // Changed: Add index signature for JWT compatibility
}

// Changed: Added bcrypt-style password hashing functions
export async function hashPassword(password: string): Promise<string> {
  // Simple hash for demonstration - in production, use bcryptjs or similar
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

// Changed: Added createToken function that accepts User object
export async function createToken(user: User): Promise<string> {
  const sessionData: SessionData = {
    userId: user.id,
    email: user.metadata.email,
    name: user.metadata.name
  }
  return createSession(sessionData)
}

// Changed: Added setSession function to set cookie
export async function setSession(token: string): Promise<void> {
  await setSessionCookie(token)
}

// Changed: Added clearSession function
export async function clearSession(): Promise<void> {
  await destroySession()
}

export async function createSession(data: SessionData): Promise<string> {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY)

  return token
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    
    // Changed: Properly validate and extract session data from JWT payload
    if (
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.name === 'string'
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        name: payload.name
      }
    }
    
    return null
  } catch (error) {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}