'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/types'

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
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
      const response = await fetch('/api/orders', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading || ordersLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and track your order history</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.metadata.order_number}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.metadata.status.value
                          )}`}
                        >
                          {order.metadata.status.value}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {formatDate(order.metadata.order_date)}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${order.metadata.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.metadata.items.length} item
                        {order.metadata.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.metadata.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.product_name}
                          </h4>
                          <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span>Size: {item.size}</span>}
                            <span>${item.price.toFixed(2)} each</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Subtotal</dt>
                        <dd className="text-gray-900">
                          ${order.metadata.subtotal.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Shipping</dt>
                        <dd className="text-gray-900">
                          ${order.metadata.shipping.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Tax</dt>
                        <dd className="text-gray-900">${order.metadata.tax.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
                        <dt className="text-gray-900">Total</dt>
                        <dd className="text-gray-900">
                          ${order.metadata.total.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Shipping Info */}
                  {order.metadata.shipping_address && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Shipping Address
                      </h4>
                      <address className="text-sm text-gray-600 not-italic">
                        {order.metadata.shipping_address.name}
                        <br />
                        {order.metadata.shipping_address.address_line1}
                        <br />
                        {order.metadata.shipping_address.address_line2 && (
                          <>
                            {order.metadata.shipping_address.address_line2}
                            <br />
                          </>
                        )}
                        {order.metadata.shipping_address.city},{' '}
                        {order.metadata.shipping_address.state}{' '}
                        {order.metadata.shipping_address.postal_code}
                        <br />
                        {order.metadata.shipping_address.country}
                      </address>
                    </div>
                  )}

                  {/* Tracking Number */}
                  {order.metadata.tracking_number && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Tracking Number:{' '}
                        <span className="font-medium text-blue-600">
                          {order.metadata.tracking_number}
                        </span>
                      </p>
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