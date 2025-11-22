import { Collection } from '@/types'

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <a
      href={`/collections/${collection.slug}`}
      className="group relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Background Image */}
      {collection.metadata.banner_image ? (
        <img
          src={`${collection.metadata.banner_image.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
          alt={collection.metadata.collection_name}
          width={800}
          height={600}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h3 className="text-3xl font-bold mb-2">
          {collection.metadata.collection_name}
        </h3>
        {collection.metadata.description && (
          <p className="text-lg text-gray-200 line-clamp-2">
            {collection.metadata.description}
          </p>
        )}
        <div className="mt-4 inline-flex items-center text-white font-semibold">
          Shop Collection
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </a>
  )
}