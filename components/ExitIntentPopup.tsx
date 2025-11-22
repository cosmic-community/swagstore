'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const { items } = useCart()

  useEffect(() => {
    // Only show if cart has items and user hasn't dismissed before
    const dismissed = localStorage.getItem('exit-intent-dismissed')
    if (dismissed || items.length === 0) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top
      if (e.clientY <= 0) {
        setShowPopup(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [items.length])

  const handleDismiss = () => {
    setShowPopup(false)
    localStorage.setItem('exit-intent-dismissed', 'true')
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">Wait! Don't leave yet!</h2>
        <p className="text-gray-600 mb-6">
          You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart. Complete your purchase now!
        </p>

        <div className="flex gap-4">
          <Link
            href="/checkout"
            onClick={handleDismiss}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Complete Purchase
          </Link>
          <button
            onClick={handleDismiss}
            className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  )
}