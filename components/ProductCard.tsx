import Link from 'next/link'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.metadata.product_images?.[0]
  const isLowStock = product.metadata.stock_quantity !== undefined && product.metadata.stock_quantity < 10 && product.metadata.stock_quantity > 0
  const isOutOfStock = product.metadata.stock_quantity !== undefined && product.metadata.stock_quantity === 0

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {primaryImage ? (
          <img
            src={`${primaryImage.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
            alt={product.metadata.product_name}
            width={600}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.metadata.featured && (
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full shadow">
              ⭐ Featured
            </span>
          )}
          {isLowStock && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow animate-pulse">
              🔥 Only {product.metadata.stock_quantity} left!
            </span>
          )}
          {isOutOfStock && (
            <span className="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full shadow">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.metadata.product_name}
        </h3>
        
        {product.metadata.collection && (
          <p className="text-sm text-gray-600 mb-2">
            {product.metadata.collection.metadata.collection_name}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ${product.metadata.price.toFixed(2)}
            </span>
            {product.metadata.price > 30 && (
              <p className="text-xs text-green-600 font-medium mt-1">
                Free shipping eligible
              </p>
            )}
          </div>
        </div>

        {product.metadata.stock_quantity !== undefined && product.metadata.stock_quantity > 0 && (
          <div className="mt-3">
            <span className="text-sm text-green-600 font-medium">
              ✓ In stock - Ships today
            </span>
          </div>
        )}

        {/* Social Proof - Simulated */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="ml-1">4.8</span>
          </div>
          <span>•</span>
          <span>{Math.floor(Math.random() * 200) + 50} sold</span>
        </div>
      </div>
    </Link>
  )
}