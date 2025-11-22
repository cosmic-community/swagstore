// app/blog/author/[slug]/page.tsx
import { getAuthor, getArticlesByAuthor } from '@/lib/cosmic'
import { Author, Article } from '@/types'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import Pagination from '@/components/Pagination'

interface AuthorPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ page?: string }>
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const currentPage = parseInt(searchParamsResolved.page || '1', 10)
  
  const author = await getAuthor(slug) as Author | null

  if (!author) {
    notFound()
  }

  const { articles, total, totalPages } = await getArticlesByAuthor(author.id, currentPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Author Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {author.metadata.avatar?.imgix_url && (
              <img
                src={`${author.metadata.avatar.imgix_url}?w=256&h=256&fit=crop&auto=format,compress`}
                alt={author.metadata.name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full mb-6 border-4 border-white shadow-lg"
              />
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {author.metadata.name}
            </h1>
            {author.metadata.bio && (
              <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mb-8">
                {author.metadata.bio}
              </p>
            )}
            <div className="flex gap-4">
              {author.metadata.twitter && (
                <a
                  href={author.metadata.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Twitter
                </a>
              )}
              {author.metadata.linkedin && (
                <a
                  href={author.metadata.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {author.metadata.website && (
                <a
                  href={author.metadata.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Website
                </a>
              )}
            </div>
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
                basePath={`/blog/author/${slug}`}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles from this author yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}