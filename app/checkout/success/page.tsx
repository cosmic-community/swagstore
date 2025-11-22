'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { CartItem } from '@/contexts/CartContext'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const [orderCreated, setOrderCreated] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Create order in Cosmic when checkout is successful
    const createOrder = async () => {
      if (!user || items.length === 0 || orderCreated) {
        return
      }

      try {
        const subtotal = items.reduce((sum, item: CartItem) => sum + item.price * item.quantity, 0)
        const shipping = 10.00
        const tax = subtotal * 0.08

        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((item: CartItem) => ({
              product_id: item.id,
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
              size: item.size
            })),
            subtotal,
            shipping,
            tax,
            total: subtotal + shipping + tax
          })
        })

        if (response.ok) {
          const data = await response.json()
          setOrderNumber(data.orderNumber)
          setOrderCreated(true)
          clearCart()
        } else {
          setError('Failed to create order')
        }
      } catch (error) {
        console.error('Failed to create order:', error)
        setError('Failed to create order')
      }
    }

    createOrder()
  }, [user, items, orderCreated, clearCart])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>

            {orderNumber && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Order Number: <span className="font-semibold">{orderNumber}</span>
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Orders
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}