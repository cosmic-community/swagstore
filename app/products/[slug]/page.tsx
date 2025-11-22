// app/products/[slug]/page.tsx
import Link from 'next/link'
import { getProduct, getProductReviews, getProducts } from '@/lib/cosmic'
import { Product, Review } from '@/types'
import { notFound } from 'next/navigation'
import ReviewCard from '@/components/ReviewCard'
import AddToCartButton from '@/components/AddToCartButton'
import RelatedProducts from '@/components/RelatedProducts'
import { Metadata } from 'next'
import RecentlyViewedTracker from '@/components/RecentlyViewedTracker'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug) as Product | null
  
  if (!product) {
    return {
      title: 'Product Not Found - SwagStore',
    }
  }

  const primaryImage = product.metadata.product_images?.[0]

  return {
    title: `${product.metadata.product_name} - SwagStore | Buy Premium ${product.metadata.collection?.metadata.collection_name || 'Merchandise'}`,
    description: product.metadata.description || `Buy ${product.metadata.product_name} at SwagStore. High-quality ${product.metadata.collection?.metadata.collection_name || 'merchandise'} with fast shipping. Price: $${product.metadata.price}`,
    keywords: `${product.metadata.product_name}, ${product.metadata.collection?.metadata.collection_name}, branded merchandise, corporate swag`,
    openGraph: {
      title: product.metadata.product_name,
      description: product.metadata.description || `Shop ${product.metadata.product_name}`,
      type: 'website', // Changed: Fixed TypeScript error - 'product' is not a valid OpenGraph type
      images: primaryImage?.imgix_url ? [{
        url: `${primaryImage.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
      }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  
  const [product, allProducts] = await Promise.all([
    getProduct(slug) as Promise<Product | null>,
    getProducts()
  ])

  if (!product) {
    notFound()
  }

  const reviews = await getProductReviews(product.id) as Review[]

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + parseInt(review.metadata.rating.key), 0) / reviews.length
    : 0

  const primaryImage = product.metadata.product_images?.[0]
  const additionalImages = product.metadata.product_images?.slice(1) || []

  const isLowStock = product.metadata.stock_quantity !== undefined && product.metadata.stock_quantity < 10 && product.metadata.stock_quantity > 0
  const isInStock = product.metadata.stock_quantity === undefined || product.metadata.stock_quantity > 0

  // JSON-LD Schema for SEO - Enhanced with more details
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.metadata.product_name,
    "description": product.metadata.description,
    "image": primaryImage?.imgix_url,
    "sku": product.metadata.sku,
    "brand": {
      "@type": "Brand",
      "name": "SwagStore"
    },
    "offers": {
      "@type": "Offer",
      "price": product.metadata.price,
      "priceCurrency": "USD",
      "availability": isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://swagstore.com/products/${product.slug}`,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "aggregateRating": reviews.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": reviews.length
    } : undefined
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Track recently viewed products for personalization */}
      <RecentlyViewedTracker productId={product.id} productSlug={product.slug} />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            {product.metadata.collection && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/collections/${product.metadata.collection.slug}`} className="hover:text-blue-600">
                  {product.metadata.collection.metadata.collection_name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.metadata.product_name}</span>
          </nav>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Images */}
              <div className="space-y-4">
                {primaryImage && (
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                    <img
                      src={`${primaryImage.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                      alt={product.title}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover"
                    />
                    {isLowStock && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                        🔥 Only {product.metadata.stock_quantity} left!
                      </div>
                    )}
                  </div>
                )}
                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {additionalImages.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={`${image.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                          alt={`${product.title} - Image ${index + 2}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.metadata.product_name}</h1>
                  {product.metadata.collection && (
                    <Link
                      href={`/collections/${product.metadata.collection.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {product.metadata.collection.title}
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-blue-600">
                    ${product.metadata.price.toFixed(2)}
                  </span>
                  {product.metadata.sku && (
                    <span className="text-gray-500">SKU: {product.metadata.sku}</span>
                  )}
                </div>

                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'fill-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}

                {/* Urgency Indicators */}
                {isLowStock && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Only {product.metadata.stock_quantity} left in stock - Order soon!</span>
                    </div>
                  </div>
                )}

                {product.metadata.description && (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.metadata.description }}
                  />
                )}

                {product.metadata.stock_quantity !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Availability:</span>
                    <span className={product.metadata.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.metadata.stock_quantity > 0
                        ? `${product.metadata.stock_quantity} in stock - Ships today`
                        : 'Out of stock'}
                    </span>
                  </div>
                )}

                {/* Free Shipping Banner */}
                {product.metadata.price >= 50 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <span className="font-semibold">Free shipping on this order!</span>
                    </div>
                  </div>
                )}

                {/* Add to Cart Section */}
                <div className="border-t pt-6">
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          <RelatedProducts 
            currentProductId={product.id}
            collectionId={product.metadata.collection?.id}
            allProducts={allProducts}
          />
        </div>
      </div>
    </>
  )
}