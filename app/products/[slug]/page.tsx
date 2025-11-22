// app/products/[slug]/page.tsx
import Link from 'next/link'
import { getProduct, getProductReviews } from '@/lib/cosmic'
import { Product, Review } from '@/types'
import { notFound } from 'next/navigation'
import ReviewCard from '@/components/ReviewCard'
import AddToCartButton from '@/components/AddToCartButton'
import { Metadata } from 'next'

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
    title: `${product.metadata.product_name} - SwagStore`,
    description: product.metadata.description || `Shop ${product.metadata.product_name} at SwagStore`,
    openGraph: {
      title: product.metadata.product_name,
      description: product.metadata.description || `Shop ${product.metadata.product_name}`,
      type: 'website',
      images: primaryImage?.imgix_url ? [{
        url: `${primaryImage.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
      }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  
  const product = await getProduct(slug) as Product | null

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {primaryImage && (
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={`${primaryImage.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                    alt={product.title}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                  />
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

              {product.metadata.description && (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.metadata.description }}
                />
              )}

              {product.metadata.stock_quantity !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Stock:</span>
                  <span className={product.metadata.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.metadata.stock_quantity > 0
                      ? `${product.metadata.stock_quantity} in stock`
                      : 'Out of stock'}
                  </span>
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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}