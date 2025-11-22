'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const { user } = useAuth()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)

  const orderNumber = searchParams?.get('order') || 'N/A'
  const total = searchParams?.get('total') || '0'

  useEffect(() => {
    // Changed: Create order in Cosmic when checkout is successful
    const createOrder = async () => {
      if (orderCreated || isCreatingOrder || !user) return

      setIsCreatingOrder(true)

      try {
        // Get cart data from localStorage
        const cartData = localStorage.getItem('cart')
        if (!cartData) {
          clearCart()
          return
        }

        const cart = JSON.parse(cartData)
        if (!cart.items || cart.items.length === 0) {
          clearCart()
          return
        }

        // Get checkout data from localStorage
        const checkoutData = localStorage.getItem('checkoutData')
        const shippingInfo = checkoutData ? JSON.parse(checkoutData) : null

        // Calculate order totals
        const subtotal = parseFloat(total)
        const shipping = 10.00 // Fixed shipping cost
        const tax = subtotal * 0.08 // 8% tax
        const totalAmount = subtotal + shipping + tax

        // Create order in Cosmic
        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            items: cart.items,
            subtotal,
            shipping,
            tax,
            total: totalAmount,
            shippingAddress: shippingInfo
          })
        })

        if (response.ok) {
          setOrderCreated(true)
          // Clear cart and checkout data after successful order creation
          clearCart()
          localStorage.removeItem('checkoutData')
        }
      } catch (error) {
        console.error('Failed to create order:', error)
      } finally {
        setIsCreatingOrder(false)
      }
    }

    createOrder()
  }, [user, orderNumber, total, clearCart, orderCreated, isCreatingOrder])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">${parseFloat(total).toFixed(2)}</p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            A confirmation email has been sent to your email address with order details and tracking information.
          </p>

          <div className="space-y-3">
            {user && (
              <Link
                href="/orders"
                className="block w-full bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
              >
                View My Orders
              </Link>
            )}
            <Link
              href="/products"
              className="block w-full bg-gray-200 text-gray-800 rounded-lg px-6 py-3 font-medium hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}