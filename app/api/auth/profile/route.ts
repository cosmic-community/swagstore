import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { updateUserProfile, getUserById } from '@/lib/cosmic'

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Update user profile
    await updateUserProfile(session.id, { name })

    // Get updated user
    const user = await getUserById(session.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return updated user data (without password hash)
    const { password_hash, ...userMetadata } = user.metadata
    return NextResponse.json({
      user: {
        ...user,
        metadata: userMetadata
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Profile update failed' },
      { status: 500 }
    )
  }
}