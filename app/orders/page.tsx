'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { Order } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, isLoading, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to create your first order!</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order {order.metadata.order_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.metadata.order_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.metadata.status.key === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.metadata.status.key === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.metadata.status.key === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.metadata.status.value}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.metadata.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.product_name} {item.size ? `(${item.size})` : ''} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                  <div className="text-lg font-bold">
                    Total: <span className="text-blue-600">${order.metadata.total.toFixed(2)}</span>
                  </div>
                  {order.metadata.tracking_number && (
                    <div className="text-sm text-gray-600">
                      Tracking: <span className="font-mono">{order.metadata.tracking_number}</span>
                    </div>
                  )}
                </div>

                {order.metadata.shipping_address && (
                  <div className="border-t mt-4 pt-4">
                    <h4 className="font-semibold mb-2 text-sm">Shipping Address:</h4>
                    <p className="text-sm text-gray-600">
                      {order.metadata.shipping_address.name}<br />
                      {order.metadata.shipping_address.address_line1}<br />
                      {order.metadata.shipping_address.address_line2 && (
                        <>{order.metadata.shipping_address.address_line2}<br /></>
                      )}
                      {order.metadata.shipping_address.city}, {order.metadata.shipping_address.state} {order.metadata.shipping_address.postal_code}<br />
                      {order.metadata.shipping_address.country}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}