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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collection Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {collection.metadata.banner_image && (
            <div className="mb-8 rounded-lg overflow-hidden max-h-64">
              <img
                src={`${collection.metadata.banner_image.imgix_url}?w=1400&h=400&fit=crop&auto=format,compress`}
                alt={collection.metadata.collection_name}
                width={1400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {collection.metadata.collection_name}
          </h1>
          {collection.metadata.description && (
            <p className="text-xl text-blue-100 max-w-3xl">
              {collection.metadata.description}
            </p>
          )}
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