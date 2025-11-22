import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

interface RelatedProductsProps {
  currentProductId: string
  collectionId?: string
  allProducts: Product[]
}

export default function RelatedProducts({ currentProductId, collectionId, allProducts }: RelatedProductsProps) {
  // Filter and sort related products
  const relatedProducts = allProducts
    .filter(p => p.id !== currentProductId)
    .map(product => {
      let score = 0
      // Same collection gets highest priority
      if (collectionId && product.metadata.collection?.id === collectionId) {
        score += 10
      }
      // Featured products get bonus
      if (product.metadata.featured) {
        score += 5
      }
      return { product, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.product)

  if (relatedProducts.length === 0) return null

  return (
    <section className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}