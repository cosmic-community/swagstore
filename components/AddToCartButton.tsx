'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  const hasSizes = product.metadata.sizes_available && product.metadata.sizes_available.length > 0
  const isInStock = product.metadata.stock_quantity === undefined || product.metadata.stock_quantity > 0

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      alert('Please select a size')
      return
    }

    if (!isInStock) {
      return
    }

    addToCart(product, quantity, selectedSize || undefined)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      {hasSizes && (
        <div>
          <label className="block text-sm font-semibold mb-2">Select Size:</label>
          <div className="flex gap-2 flex-wrap">
            {product.metadata.sizes_available?.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                  selectedSize === size
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-semibold mb-2">Quantity:</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={!isInStock}
          >
            -
          </button>
          <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={!isInStock}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!isInStock}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
          isInStock
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isInStock ? 'Add to Cart' : 'Out of Stock'}
      </button>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center">
          ✓ Added to cart successfully!
        </div>
      )}
    </div>
  )
}