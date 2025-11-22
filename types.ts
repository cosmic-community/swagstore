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

// Homepage settings type
export interface HomepageSettings extends CosmicObject {
  type: 'homepage-settings'
  metadata: {
    hero_background_image?: {
      url: string
      imgix_url: string
    }
    hero_title?: string
    hero_subtitle?: string
  }
}

// About page type
export interface AboutPage extends CosmicObject {
  type: 'about-page'
  metadata: {
    page_title: string
    hero_image?: {
      url: string
      imgix_url: string
    }
    company_description: string
    mission_statement?: string
    vision_statement?: string
    company_values?: string
    team_section_title?: string
    team_members?: Array<{
      name: string
      role: string
      bio?: string
      image?: {
        url: string
        imgix_url: string
      }
    }>
  }
}

// User type for authentication
export interface User extends CosmicObject {
  type: 'users'
  metadata: {
    name: string
    email: string
    password_hash: string
    created_date?: string
    last_login?: string
    profile_image?: {
      url: string
      imgix_url: string
    }
  }
}

// Blog Author type
export interface Author extends CosmicObject {
  type: 'authors'
  metadata: {
    name: string
    bio?: string
    avatar?: {
      url: string
      imgix_url: string
    }
    twitter?: string
    linkedin?: string
    website?: string
  }
}

// Blog Category type
export interface Category extends CosmicObject {
  type: 'categories'
  metadata: {
    name: string
    description?: string
    color?: string
  }
}

// Blog Tag type
export interface Tag extends CosmicObject {
  type: 'tags'
  metadata: {
    name: string
  }
}

// Blog Article type
export interface Article extends CosmicObject {
  type: 'articles'
  metadata: {
    title: string
    excerpt?: string
    content: string
    featured_image?: {
      url: string
      imgix_url: string
    }
    author: Author
    category: Category
    tags?: Tag[]
    published_date: string
    read_time?: number
    featured?: boolean
    seo_title?: string
    seo_description?: string
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

export function isHomepageSettings(obj: CosmicObject): obj is HomepageSettings {
  return obj.type === 'homepage-settings'
}

export function isAboutPage(obj: CosmicObject): obj is AboutPage {
  return obj.type === 'about-page'
}

export function isUser(obj: CosmicObject): obj is User {
  return obj.type === 'users'
}

export function isAuthor(obj: CosmicObject): obj is Author {
  return obj.type === 'authors'
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories'
}

export function isTag(obj: CosmicObject): obj is Tag {
  return obj.type === 'tags'
}

export function isArticle(obj: CosmicObject): obj is Article {
  return obj.type === 'articles'
}