import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating user with:', { name, email, hasPassword: !!password })

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // Get current date in YYYY-MM-DD format (CRITICAL: This is the required format for date metafields)
    const now = new Date()
    const createdDate = now.toISOString().split('T')[0] // Format: YYYY-MM-DD

    // Create user in Cosmic
    try {
      const response = await cosmic.objects.insertOne({
        title: name,
        type: 'users',
        metadata: {
          email,
          password_hash: passwordHash,
          created_date: createdDate // Changed: Using YYYY-MM-DD format instead of ISO string
        }
      })

      return NextResponse.json({
        success: true,
        user: {
          id: response.object.id,
          name: response.object.title,
          email: response.object.metadata.email
        }
      })
    } catch (cosmicError: any) {
      console.error('Failed to create user - Full error:', {
        error: cosmicError,
        message: cosmicError?.message || 'Unknown error',
        stack: cosmicError?.stack,
        name,
        email
      })
      throw new Error(`Failed to create user: ${cosmicError?.message || 'Unknown error'}`)
    }
  } catch (error: any) {
    console.error('User creation error details:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}