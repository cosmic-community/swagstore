'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types'

export default function RecentlyViewedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        
        if (recentlyViewed.length === 0) {
          setLoading(false)
          return
        }

        // Fetch product details for recently viewed items
        const productIds = recentlyViewed.map((item: any) => item.id).slice(0, 6)
        
        const response = await fetch('/api/products/recently-viewed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds })
        })

        if (response.ok) {
          const data = await response.json()
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Error fetching recently viewed products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyViewed()
  }, [])

  if (loading || products.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => {
          const primaryImage = product.metadata.product_images?.[0]
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                {primaryImage && (
                  <img
                    src={`${primaryImage.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                {product.metadata.product_name}
              </h3>
              <p className="text-sm font-bold text-blue-600 mt-1">
                ${product.metadata.price.toFixed(2)}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}