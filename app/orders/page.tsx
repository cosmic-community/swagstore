'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Order, OrderStatus } from '@/types'

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      } else {
        setError('Failed to load orders')
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setError('Failed to load orders')
    } finally {
      setLoadingOrders(false)
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Processing':
        return 'bg-blue-100 text-blue-800'
      case 'Shipped':
        return 'bg-purple-100 text-purple-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading || loadingOrders) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-gray-500">Start shopping to see your orders here.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.metadata.order_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.metadata.order_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.metadata.status.key
                      )}`}
                    >
                      {order.metadata.status.value}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.metadata.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <p className="text-gray-900 font-medium">{item.product_name}</p>
                            <p className="text-gray-500">
                              Quantity: {item.quantity}
                              {item.size && ` • Size: ${item.size}`}
                            </p>
                          </div>
                          <p className="text-gray-900 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${order.metadata.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">${order.metadata.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">${order.metadata.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">${order.metadata.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {order.metadata.shipping_address && (
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
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

                  {order.metadata.tracking_number && (
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tracking Number</h4>
                      <p className="text-sm text-gray-600">{order.metadata.tracking_number}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}