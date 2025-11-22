import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createOrder } from '@/lib/cosmic'
import { OrderItem } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getSession()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, subtotal, shipping, tax, total, shippingAddress } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order in Cosmic
    const order = await createOrder(
      user.id,
      orderNumber,
      items as OrderItem[],
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress
    )

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.metadata.order_number,
        total: order.metadata.total
      }
    })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}