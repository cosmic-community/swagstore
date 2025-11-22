import { getCollections } from '@/lib/cosmic'
import { Collection } from '@/types'
import CollectionCard from '@/components/CollectionCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections - SwagStore',
  description: 'Browse our curated collections of premium branded merchandise',
  openGraph: {
    title: 'Collections - SwagStore',
    description: 'Browse our curated collections of premium branded merchandise',
    type: 'website',
  },
}

export default async function CollectionsPage() {
  const collections = await getCollections() as Collection[]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Our Collections
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Explore our curated collections of premium branded merchandise
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No collections available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}