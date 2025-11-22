import { NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { Product } from '@/types'

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ products: [] })
    }

    // Fetch products by IDs
    const response = await cosmic.objects
      .find({
        type: 'products',
        'id': { $in: productIds }
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    const products = response.objects as Product[]

    // Sort products to match the order of requested IDs
    const sortedProducts = productIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as Product[]

    return NextResponse.json({ products: sortedProducts })
  } catch (error) {
    console.error('Error fetching recently viewed products:', error)
    return NextResponse.json({ products: [] })
  }
}