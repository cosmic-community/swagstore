import Link from 'next/link'
import { Article } from '@/types'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const featuredImage = article.metadata.featured_image?.imgix_url || article.thumbnail
  const publishedDate = new Date(article.metadata.published_date || article.created_at)
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Article Image */}
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {featuredImage ? (
          <img
            src={`${featuredImage}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={article.metadata.title}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Article Info */}
      <div className="p-6">
        {/* Category Badge */}
        {article.metadata.category && (
          <span 
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3"
            style={{
              backgroundColor: article.metadata.category.metadata?.color || '#3B82F6',
              color: 'white'
            }}
          >
            {article.metadata.category.metadata.name}
          </span>
        )}

        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.metadata.title}
        </h3>

        {article.metadata.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.metadata.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            {article.metadata.author && (
              <div className="flex items-center gap-2">
                {article.metadata.author.metadata?.avatar?.imgix_url && (
                  <img
                    src={`${article.metadata.author.metadata.avatar.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                    alt={article.metadata.author.metadata.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{article.metadata.author.metadata.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <span>{formattedDate}</span>
            {article.metadata.read_time && (
              <span>{article.metadata.read_time} min read</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}