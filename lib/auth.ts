import { cookies } from 'next/headers'
import { User } from '@/types'
import { cosmic } from './cosmic'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'cosmic_session'

export interface SessionData {
  userId: string
  email: string
  createdAt: number
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Create JWT-like token (simplified for session cookie)
export async function createToken(user: User): Promise<string> {
  const sessionData: SessionData = {
    userId: user.id,
    email: user.metadata.email,
    createdAt: Date.now()
  }
  return JSON.stringify(sessionData)
}

// Set session cookie
export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })
}

// Clear session cookie
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    
    if (!sessionCookie?.value) {
      return null
    }

    const sessionData: SessionData = JSON.parse(sessionCookie.value)
    
    // Verify session is not expired (24 hours)
    const expiryTime = 24 * 60 * 60 * 1000
    if (Date.now() - sessionData.createdAt > expiryTime) {
      return null
    }

    // Fetch user from Cosmic
    const { object } = await cosmic.objects
      .findOne({
        type: 'users',
        id: sessionData.userId
      })
      .props(['id', 'slug', 'title', 'metadata'])

    return object as User
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export async function createSession(user: User): Promise<void> {
  const sessionData: SessionData = {
    userId: user.id,
    email: user.metadata.email,
    createdAt: Date.now()
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}