import { getArticles, getCategories, getFeaturedArticles } from '@/lib/cosmic'
import { Article, Category } from '@/types'
import ArticleCard from '@/components/ArticleCard'
import Pagination from '@/components/Pagination'

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  
  const [{ articles, total, totalPages }, categories, featuredArticles] = await Promise.all([
    getArticles(currentPage),
    getCategories(),
    getFeaturedArticles()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              SwagStore Blog
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Stories, insights, and updates from our team
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && currentPage === 1 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      {categories.length > 0 && (
        <section className="py-8 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/blog"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
              >
                All Articles
              </a>
              {categories.map((category: Category) => (
                <a
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {category.metadata.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {currentPage === 1 ? 'Latest Articles' : `Articles - Page ${currentPage}`}
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
                basePath="/blog"
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}