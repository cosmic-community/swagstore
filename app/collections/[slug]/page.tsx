// app/collections/[slug]/page.tsx
import { getCollection, getProductsByCollection } from '@/lib/cosmic'
import { Collection, Product } from '@/types'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

interface CollectionPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  
  const collection = await getCollection(slug) as Collection | null

  if (!collection) {
    notFound()
  }

  const products = await getProductsByCollection(collection.id) as Product[]

  const heroBackgroundImage = collection.metadata.banner_image?.imgix_url

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collection Header */}
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
              {collection.metadata.collection_name}
            </h1>
            {collection.metadata.description && (
              <p className="text-xl sm:text-2xl mb-8 text-blue-100">
                {collection.metadata.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products in this collection yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}