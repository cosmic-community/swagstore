// app/blog/category/[slug]/page.tsx
import { getCategory, getArticlesByCategory, getCategories } from '@/lib/cosmic'
import { Category, Article } from '@/types'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import Pagination from '@/components/Pagination'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ page?: string }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const currentPage = parseInt(searchParamsResolved.page || '1', 10)
  
  const [category, { articles, total, totalPages }, allCategories] = await Promise.all([
    getCategory(slug),
    getArticlesByCategory((await getCategory(slug))?.id || '', currentPage),
    getCategories()
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <section 
        className="py-20 text-white"
        style={{
          backgroundColor: category.metadata.color || '#3B82F6'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {category.metadata.name}
            </h1>
            {category.metadata.description && (
              <p className="text-xl sm:text-2xl opacity-90">
                {category.metadata.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      {allCategories.length > 0 && (
        <section className="py-8 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/blog"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
              >
                All Articles
              </a>
              {allCategories.map((cat: Category) => (
                <a
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    cat.id === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {cat.metadata.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

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
                basePath={`/blog/category/${slug}`}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}