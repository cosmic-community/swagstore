import { getProducts } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products - SwagStore',
  description: 'Browse our complete collection of premium branded merchandise. Find the perfect products for your business needs.',
  openGraph: {
    title: 'All Products - SwagStore',
    description: 'Browse our complete collection of premium branded merchandise',
    type: 'website',
  },
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-lg text-gray-600">
            Browse our complete collection of premium branded merchandise
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}