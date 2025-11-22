import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.metadata.product_images?.[0]

  return (
    <a
      href={`/products/${product.slug}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
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
          <span className="text-2xl font-bold text-blue-600">
            ${product.metadata.price.toFixed(2)}
          </span>
          
          {product.metadata.featured && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              Featured
            </span>
          )}
        </div>

        {product.metadata.stock_quantity !== undefined && (
          <div className="mt-3">
            <span className={`text-sm ${product.metadata.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.metadata.stock_quantity > 0
                ? `${product.metadata.stock_quantity} in stock`
                : 'Out of stock'}
            </span>
          </div>
        )}
      </div>
    </a>
  )
}