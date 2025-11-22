// Base Cosmic object interface
export interface CosmicObject {
  id: string
  slug: string
  title: string
  content?: string
  metadata: Record<string, any>
  type: string
  created_at: string
  modified_at: string
  thumbnail?: string
}

// Product type with full metadata structure
export interface Product extends CosmicObject {
  type: 'products'
  metadata: {
    product_name: string
    description?: string
    price: number
    product_images?: Array<{
      url: string
      imgix_url: string
    }>
    sku?: string
    stock_quantity?: number
    sizes_available?: string[] | null
    featured?: boolean
    collection?: Collection
  }
}

// Collection type
export interface Collection extends CosmicObject {
  type: 'collections'
  metadata: {
    collection_name: string
    description?: string
    banner_image?: {
      url: string
      imgix_url: string
    }
    display_order?: number
  }
}

// Review rating type literal - must match content model exactly
export type ReviewRating = '1' | '2' | '3' | '4' | '5'

// Review type
export interface Review extends CosmicObject {
  type: 'reviews'
  metadata: {
    product: Product
    rating: {
      key: ReviewRating
      value: string
    }
    review_title?: string
    review_content: string
    reviewer_name: string
    verified_purchase?: boolean
    review_date?: string
  }
}

// API response types
export interface CosmicResponse<T> {
  objects: T[]
  total: number
  limit?: number
  skip?: number
}

// Type guards for runtime validation
export function isProduct(obj: CosmicObject): obj is Product {
  return obj.type === 'products'
}

export function isCollection(obj: CosmicObject): obj is Collection {
  return obj.type === 'collections'
}

export function isReview(obj: CosmicObject): obj is Review {
  return obj.type === 'reviews'
}