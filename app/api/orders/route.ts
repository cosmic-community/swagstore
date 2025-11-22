import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getOrdersByUserId } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isValid || !authResult.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch orders for the user
    const orders = await getOrdersByUserId(authResult.userId)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}