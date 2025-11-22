import Link from 'next/link'
import { getProducts, getCollections, getFeaturedProducts, getHomepageSettings } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import CollectionCard from '@/components/CollectionCard'
import NewsletterPopup from '@/components/NewsletterPopup'
import { Product, Collection, HomepageSettings } from '@/types'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SwagStore - Premium Branded Merchandise | Custom Corporate Swag',
  description: 'Shop premium branded merchandise and custom corporate swag. High-quality apparel, accessories, and promotional products. Free shipping on orders over $50. Same-day fulfillment available.',
  keywords: 'branded merchandise, corporate swag, custom apparel, promotional products, business gifts',
  openGraph: {
    title: 'SwagStore - Premium Branded Merchandise',
    description: 'Shop our collection of premium branded apparel and accessories',
    type: 'website',
  },
}

export default async function Home() {
  const [products, collections, featuredProducts, homepageSettings] = await Promise.all([
    getProducts(),
    getCollections(),
    getFeaturedProducts(),
    getHomepageSettings()
  ])

  const settings = homepageSettings as HomepageSettings | null
  const heroBackgroundImage = settings?.metadata?.hero_background_image?.imgix_url
  const heroTitle = settings?.metadata?.hero_title || 'Premium Branded Merchandise'
  const heroSubtitle = settings?.metadata?.hero_subtitle || 'Discover our collection of high-quality apparel and accessories'

  return (
    <div className="min-h-screen">
      {/* Newsletter Popup for Exit Intent */}
      <NewsletterPopup />

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 text-center text-sm font-medium">
        🎉 Limited Time Offer: Free Shipping on Orders Over $50 + 15% Off Your First Order! Use Code: FIRST15
      </div>

      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20"
        style={heroBackgroundImage ? {
          backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.8), rgba(30, 64, 175, 0.8)), url(${heroBackgroundImage}?w=2000&h=800&fit=crop&auto=format,compress)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {heroTitle}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg text-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/collections/apparel"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
              >
                View Collections
              </Link>
            </div>
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Shipping Over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Same-Day Fulfillment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-gray-600">Handpicked favorites from our collection</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shop by Collection</h2>
              <p className="text-gray-600">Explore our curated product collections</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection: Collection) => (
                <CollectionCard key={collection.id} collection={collection as Collection} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Proof Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Products Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Products Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Recent Products</h2>
              <p className="text-gray-600 mt-2">Check out our latest additions</p>
            </div>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product: Product) => (
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

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-xl text-blue-100 mb-8">Get 15% off your first order + exclusive deals and updates</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-blue-100 mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  )
}