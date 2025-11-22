import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, updateLastLogin } from '@/lib/cosmic'
import { verifyPassword, createToken, setSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user by email
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.metadata.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login time
    await updateLastLogin(user.id)

    // Create JWT token
    const token = await createToken(user)

    // Set session cookie
    await setSession(token)

    // Return user data (without password hash)
    const { password_hash, ...userMetadata } = user.metadata
    return NextResponse.json({
      user: {
        ...user,
        metadata: userMetadata
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}