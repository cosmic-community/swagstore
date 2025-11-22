import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getOrdersByUserId } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getSession()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch orders for the user
    const orders = await getOrdersByUserId(user.id)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}