import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/cosmic'
import { hashPassword, createToken, setSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user with detailed error logging
    let user
    try {
      user = await createUser(name, email, passwordHash)
    } catch (createError) {
      console.error('User creation error details:', createError)
      return NextResponse.json(
        { error: 'Failed to create user account. Please try again.' },
        { status: 500 }
      )
    }

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
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Signup failed. Please try again.' },
      { status: 500 }
    )
  }
}