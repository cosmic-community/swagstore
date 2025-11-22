import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import bcrypt from 'bcryptjs'

interface CreateUserPayload {
  name: string
  email: string
  password: string
}

interface CosmicError {
  error?: {
    status?: number
    message?: string
  }
  message?: string
  stack?: string
}

function isCosmicError(error: unknown): error is CosmicError {
  return typeof error === 'object' && error !== null && ('error' in error || 'message' in error)
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json() as CreateUserPayload

    console.log('Creating user with:', { name, email, hasPassword: !!password })

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Get current date in YYYY-MM-DD format for Cosmic date metafield
    const now = new Date()
    const createdDate = now.toISOString().split('T')[0] // Format: YYYY-MM-DD

    try {
      // Create user in Cosmic
      const { object: user } = await cosmic.objects.insertOne({
        title: name,
        type: 'users',
        metadata: {
          email,
          password_hash: hashedPassword,
          created_date: createdDate // Use YYYY-MM-DD format
        }
      })

      console.log('User created successfully:', user.id)

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.title,
          email: user.metadata?.email as string
        }
      })
    } catch (cosmicError: unknown) {
      console.error('Failed to create user - Full error:', {
        error: isCosmicError(cosmicError) ? cosmicError.error : cosmicError,
        message: isCosmicError(cosmicError) ? cosmicError.message : 'Unknown error',
        stack: isCosmicError(cosmicError) ? cosmicError.stack : undefined,
        name,
        email
      })
      
      const errorMessage = isCosmicError(cosmicError) && cosmicError.error?.message 
        ? cosmicError.error.message 
        : isCosmicError(cosmicError) && cosmicError.message
        ? cosmicError.message
        : 'Unknown error'
      
      throw new Error(`Failed to create user: ${errorMessage}`)
    }
  } catch (error: unknown) {
    console.error('Signup error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}