import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { cosmic } from '@/lib/cosmic'
import { OrderItem } from '@/types'

interface ShippingAddress {
  name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, email, items, subtotal, shipping, tax, total, shipping_address } = body

    // Validate user matches session
    if (userId !== session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Format date as YYYY-MM-DD for Cosmic date field
    const today = new Date()
    const orderDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    // Create order in Cosmic
    const response = await cosmic.objects.insertOne({
      title: orderNumber,
      type: 'orders',
      metadata: {
        user: userId,
        order_number: orderNumber,
        order_date: orderDate,
        status: 'Pending',
        items: items as OrderItem[],
        subtotal: Number(subtotal),
        shipping: Number(shipping),
        tax: Number(tax),
        total: Number(total),
        shipping_address: shipping_address as ShippingAddress
      }
    })

    return NextResponse.json({ 
      success: true, 
      order: response.object 
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}