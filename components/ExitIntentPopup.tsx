'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const { items } = useCart()

  useEffect(() => {
    // Fixed: Access items.length instead of cart.length
    // Only show if user has items in cart
    if (items.length === 0) return
    
    // Check if already shown in this session
    if (sessionStorage.getItem('exitIntentShown')) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect if mouse is leaving from top of viewport
      if (e.clientY < 50 && !hasShown) {
        setShowPopup(true)
        setHasShown(true)
        sessionStorage.setItem('exitIntentShown', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [items.length, hasShown])

  if (!showPopup) return null

  const discount = 10 // 10% discount offer

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close popup"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mb-4">
            <span className="text-6xl">🎁</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Wait! Don't Leave Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You have {items.length} {items.length === 1 ? 'item' : 'items'} in your cart. 
            Complete your order now and get <span className="font-bold text-blue-600">{discount}% OFF</span>!
          </p>
          <div className="space-y-3">
            <Link
              href="/checkout"
              onClick={() => setShowPopup(false)}
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Complete My Order
            </Link>
            <button
              onClick={() => setShowPopup(false)}
              className="block w-full text-gray-600 py-2 hover:text-gray-900"
            >
              Continue Shopping
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Use code <span className="font-mono font-bold">SAVE{discount}</span> at checkout
          </p>
        </div>
      </div>
    </div>
  )
}