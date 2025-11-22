// app/blog/tag/[slug]/page.tsx
import { getTag, getArticlesByTag } from '@/lib/cosmic'
import { Tag, Article } from '@/types'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import Pagination from '@/components/Pagination'

interface TagPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ page?: string }>
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const currentPage = parseInt(searchParamsResolved.page || '1', 10)
  
  const tag = await getTag(slug) as Tag | null

  if (!tag) {
    notFound()
  }

  const { articles, total, totalPages } = await getArticlesByTag(tag.id, currentPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tag Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-white bg-opacity-20 rounded-full mb-6">
              <span className="text-2xl">🏷️</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              #{tag.metadata.name}
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100">
              Articles tagged with {tag.metadata.name}
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {currentPage === 1 ? 'Articles' : `Articles - Page ${currentPage}`}
            </h2>
            <span className="text-gray-600">{total} articles</span>
          </div>

          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: Article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/blog/tag/${slug}`}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles with this tag yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}