import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getOrdersByUserId } from '@/lib/cosmic'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get orders for the logged-in user
    const orders = await getOrdersByUserId(session.userId)
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}