import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserById } from '@/lib/cosmic'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ user: null })
    }

    // Get full user data
    const user = await getUserById(session.userId)
    
    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Return user data (without password hash)
    const { password_hash, ...userMetadata } = user.metadata
    return NextResponse.json({
      user: {
        ...user,
        metadata: userMetadata
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null })
  }
}