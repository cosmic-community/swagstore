// app/blog/[slug]/page.tsx
import { getArticle, getRelatedArticles } from '@/lib/cosmic'
import { Article } from '@/types'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  
  const article = await getArticle(slug) as Article | null

  if (!article) {
    notFound()
  }

  // Get related articles
  const tagIds = article.metadata.tags?.map(tag => tag.id) || []
  const relatedArticles = await getRelatedArticles(
    article.id,
    article.metadata.category.id,
    tagIds
  ) as Article[]

  const featuredImage = article.metadata.featured_image?.imgix_url || article.thumbnail
  const publishedDate = new Date(article.metadata.published_date || article.created_at)
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <article className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Badge */}
          {article.metadata.category && (
            <a
              href={`/blog/category/${article.metadata.category.slug}`}
              className="inline-block px-4 py-2 text-sm font-semibold rounded-full mb-6"
              style={{
                backgroundColor: article.metadata.category.metadata?.color || '#3B82F6',
                color: 'white'
              }}
            >
              {article.metadata.category.metadata.name}
            </a>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
            {article.metadata.title}
          </h1>

          {/* Excerpt */}
          {article.metadata.excerpt && (
            <p className="text-xl text-gray-600 mb-8">
              {article.metadata.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            {/* Author */}
            {article.metadata.author && (
              <a
                href={`/blog/author/${article.metadata.author.slug}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {article.metadata.author.metadata?.avatar?.imgix_url && (
                  <img
                    src={`${article.metadata.author.metadata.avatar.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                    alt={article.metadata.author.metadata.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {article.metadata.author.metadata.name}
                  </div>
                  <div className="text-sm text-gray-500">Author</div>
                </div>
              </a>
            )}

            {/* Date and Read Time */}
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formattedDate}</span>
              </div>
              {article.metadata.read_time && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{article.metadata.read_time} min read</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {featuredImage && (
            <div className="aspect-video rounded-lg overflow-hidden mb-8">
              <img
                src={`${featuredImage}?w=1600&h=900&fit=crop&auto=format,compress`}
                alt={article.metadata.title}
                width={1600}
                height={900}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.metadata.content }}
          />

          {/* Tags */}
          {article.metadata.tags && article.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-200">
              <span className="text-gray-600 font-semibold">Tags:</span>
              {article.metadata.tags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag.metadata.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Author Bio */}
        {article.metadata.author && article.metadata.author.metadata?.bio && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start gap-6">
                {article.metadata.author.metadata?.avatar?.imgix_url && (
                  <img
                    src={`${article.metadata.author.metadata.avatar.imgix_url}?w=192&h=192&fit=crop&auto=format,compress`}
                    alt={article.metadata.author.metadata.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    {article.metadata.author.metadata.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {article.metadata.author.metadata.bio}
                  </p>
                  <div className="flex gap-4">
                    {article.metadata.author.metadata.twitter && (
                      <a
                        href={article.metadata.author.metadata.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Twitter
                      </a>
                    )}
                    {article.metadata.author.metadata.linkedin && (
                      <a
                        href={article.metadata.author.metadata.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        LinkedIn
                      </a>
                    )}
                    {article.metadata.author.metadata.website && (
                      <a
                        href={article.metadata.author.metadata.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle: Article) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}