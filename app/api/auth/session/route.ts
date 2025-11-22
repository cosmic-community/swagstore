import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserById } from '@/lib/cosmic'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      )
    }

    // Get user data from Cosmic
    const user = await getUserById(session.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
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
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    )
  }
}