'use client'

import { useEffect, useState } from 'react'

interface Purchase {
  productName: string
  location: string
  timeAgo: string
}

export default function SocialProofNotification() {
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Simulated recent purchases data (in production, this would come from an API)
  const recentPurchases: Purchase[] = [
    { productName: 'Premium T-Shirt', location: 'New York, NY', timeAgo: '2 minutes ago' },
    { productName: 'Coffee Mug Set', location: 'Los Angeles, CA', timeAgo: '5 minutes ago' },
    { productName: 'Laptop Stickers', location: 'Chicago, IL', timeAgo: '8 minutes ago' },
    { productName: 'Canvas Tote Bag', location: 'Austin, TX', timeAgo: '12 minutes ago' },
    { productName: 'Baseball Cap', location: 'Seattle, WA', timeAgo: '15 minutes ago' },
  ]

  useEffect(() => {
    let currentIndex = 0
    
    const showNextPurchase = () => {
      setCurrentPurchase(recentPurchases[currentIndex])
      setIsVisible(true)
      
      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      
      currentIndex = (currentIndex + 1) % recentPurchases.length
    }

    // Show first notification after 10 seconds
    const initialTimeout = setTimeout(() => {
      showNextPurchase()
      
      // Then show every 30 seconds
      const interval = setInterval(showNextPurchase, 30000)
      
      return () => clearInterval(interval)
    }, 10000)

    return () => {
      clearTimeout(initialTimeout)
    }
  }, [])

  if (!currentPurchase || !isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm animate-slide-in-left">
      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {currentPurchase.productName}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Someone from <span className="font-medium">{currentPurchase.location}</span> purchased this
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {currentPurchase.timeAgo}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}