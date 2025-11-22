import Link from 'next/link'
import { Collection } from '@/types'

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const imageUrl = collection.metadata.banner_image?.imgix_url
  const optimizedImageUrl = imageUrl 
    ? `${imageUrl}?w=800&h=600&fit=crop&auto=format,compress`
    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop&auto=format,compress'

  return (
    <Link 
      href={`/collections/${collection.slug}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Collection Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={optimizedImageUrl}
          alt={collection.metadata.collection_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {collection.metadata.collection_name}
          </h3>
        </div>
      </div>

      {/* Collection Description */}
      {collection.metadata.description && (
        <div className="p-6">
          <p className="text-gray-600 line-clamp-2">
            {collection.metadata.description}
          </p>
          <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
            View Collection
            <svg 
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </Link>
  )
}