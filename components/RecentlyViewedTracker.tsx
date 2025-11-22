'use client'

import { useEffect } from 'react'

interface RecentlyViewedTrackerProps {
  productId: string
  productSlug: string
}

export default function RecentlyViewedTracker({ productId, productSlug }: RecentlyViewedTrackerProps) {
  useEffect(() => {
    // Track recently viewed products in localStorage for personalization
    const trackView = () => {
      try {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        
        // Remove if already exists to avoid duplicates
        const filtered = recentlyViewed.filter((item: any) => item.id !== productId)
        
        // Add to beginning of array
        const updated = [
          { id: productId, slug: productSlug, viewedAt: new Date().toISOString() },
          ...filtered
        ].slice(0, 10) // Keep only last 10 viewed products
        
        localStorage.setItem('recentlyViewed', JSON.stringify(updated))
      } catch (error) {
        console.error('Error tracking recently viewed product:', error)
      }
    }

    trackView()
  }, [productId, productSlug])

  return null // This component doesn't render anything
}