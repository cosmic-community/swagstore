'use client'

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 3) {
        // Near start
        pages.push(2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        // Middle
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : '#'}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          currentPage > 1
            ? 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
        }`}
      >
        Previous
      </Link>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <Link
              key={pageNum}
              href={`${basePath}?page=${pageNum}`}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
              }`}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : '#'}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          currentPage < totalPages
            ? 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
        }`}
      >
        Next
      </Link>
    </div>
  )
}