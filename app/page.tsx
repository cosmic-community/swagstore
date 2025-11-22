import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import CollectionCard from '@/components/CollectionCard'
import { getProducts, getCollections, getHomepageSettings } from '@/lib/cosmic'
import { Product, Collection, HomepageSettings } from '@/types'
import RecentlyViewedProducts from '@/components/RecentlyViewedProducts'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const [products, collections, settings] = await Promise.all([
    getProducts(),
    getCollections(),
    getHomepageSettings()
  ])

  // Get featured products
  const featuredProducts = products
    .filter(p => p.metadata.featured)
    .slice(0, 4) as Product[]

  // If no featured products, show first 4
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4) as Product[]

  // Get first 4 collections
  const displayCollections = collections.slice(0, 4) as Collection[]

  const heroSettings = settings as HomepageSettings | null
  const heroImage = heroSettings?.metadata.hero_background_image
  const heroTitle = heroSettings?.metadata.hero_title || 'Premium Branded Merchandise'
  const heroSubtitle = heroSettings?.metadata.hero_subtitle || 'Elevate your brand with high-quality swag'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={`${heroImage.imgix_url}?w=2000&h=800&fit=crop&auto=format,compress`}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{heroTitle}</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">{heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Shop All Products
            </Link>
            <Link
              href="/collections"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors border-2 border-white"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gray-50 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-900">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">100% satisfaction</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-900">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day policy</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-600">SSL encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RecentlyViewedProducts />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-2">Check out our most popular items</p>
          </div>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            View All
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Collection</h2>
            <p className="text-gray-600 mt-2">Explore our curated product collections</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Brand?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust SwagStore for their branded merchandise
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  )
}