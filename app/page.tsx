import { getProducts, getCollections, getFeaturedProducts, getHomepageSettings } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import CollectionCard from '@/components/CollectionCard'
import { Product, Collection, HomepageSettings } from '@/types'

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
            <a
              href="/products"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
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
            <h2 className="text-3xl font-bold mb-8 text-center">Shop by Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collections.map((collection: Collection) => (
                <CollectionCard key={collection.id} collection={collection as Collection} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Products Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Products</h2>
            <a
              href="/products"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
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
    </div>
  )
}