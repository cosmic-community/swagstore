'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { CartItem } from '@/lib/cart'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart, items } = useCart()
  const { user } = useAuth()
  const [orderNumber, setOrderNumber] = useState('')
  const [isCreatingOrder, setIsCreatingOrder] = useState(true)

  useEffect(() => {
    const createOrder = async () => {
      // Get order details from URL params
      const subtotal = parseFloat(searchParams.get('subtotal') || '0')
      const shipping = parseFloat(searchParams.get('shipping') || '0')
      const tax = parseFloat(searchParams.get('tax') || '0')
      const total = parseFloat(searchParams.get('total') || '0')
      const shippingData = searchParams.get('shipping_address')

      if (!user) {
        // If no user, just clear cart and show success
        clearCart()
        setIsCreatingOrder(false)
        return
      }

      try {
        // Create order in Cosmic
        const orderItems = items.map((item: CartItem) => ({
          product_id: item.product.id,
          product_name: item.product.metadata.product_name,
          quantity: item.quantity,
          price: item.product.metadata.price,
          size: item.size
        }))

        const shippingAddress = shippingData ? JSON.parse(decodeURIComponent(shippingData)) : undefined

        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: orderItems,
            subtotal,
            shipping,
            tax,
            total,
            shippingAddress
          })
        })

        if (response.ok) {
          const data = await response.json()
          setOrderNumber(data.order.orderNumber)
        }
      } catch (error) {
        console.error('Failed to create order:', error)
      } finally {
        clearCart()
        setIsCreatingOrder(false)
      }
    }

    createOrder()
  }, [searchParams, clearCart, items, user])

  if (isCreatingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
            </div>
          )}

          <div className="space-y-3">
            {user && (
              <Link
                href="/orders"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View My Orders
              </Link>
            )}
            <Link
              href="/products"
              className="block w-full bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="block w-full text-gray-600 hover:text-gray-900 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}