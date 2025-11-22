import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error
}

// Get all products with collection data
export async function getProducts() {
  try {
    const response = await cosmic.objects
      .find({ type: 'products' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch products')
  }
}

// Get a single product by slug
export async function getProduct(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'products', slug })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(1)
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch product')
  }
}

// Get all collections
export async function getCollections() {
  try {
    const response = await cosmic.objects
      .find({ type: 'collections' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
    
    // Sort by display_order if available
    const collections = response.objects.sort((a: any, b: any) => {
      const orderA = a.metadata?.display_order || 0
      const orderB = b.metadata?.display_order || 0
      return orderA - orderB
    })
    
    return collections
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch collections')
  }
}

// Get a single collection by slug
export async function getCollection(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'collections', slug })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch collection')
  }
}

// Get products by collection
export async function getProductsByCollection(collectionId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'products',
        'metadata.collection': collectionId 
      })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch products by collection')
  }
}

// Get reviews for a specific product
export async function getProductReviews(productId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'reviews',
        'metadata.product': productId 
      })
      .props(['id', 'title', 'metadata'])
      .depth(1)
    
    // Sort by review_date descending (newest first)
    const reviews = response.objects.sort((a: any, b: any) => {
      const dateA = new Date(a.metadata?.review_date || '').getTime()
      const dateB = new Date(b.metadata?.review_date || '').getTime()
      return dateB - dateA
    })
    
    return reviews
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch product reviews')
  }
}

// Get featured products
export async function getFeaturedProducts() {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'products',
        'metadata.featured': true 
      })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch featured products')
  }
}

// Get homepage settings (singleton)
export async function getHomepageSettings() {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'homepage-settings', slug: 'homepage-settings' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch homepage settings')
  }
}

// Get about page content (singleton)
export async function getAboutPage() {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'about-page', slug: 'about' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch about page')
  }
}

// User authentication functions

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'users',
        'metadata.email': email 
      })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects[0] || null
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch user')
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  try {
    const response = await cosmic.objects
      .findOne({ 
        type: 'users',
        id: userId 
      })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch user')
  }
}

// Helper function to format date as YYYY-MM-DD for Cosmic date fields
function formatDateForCosmic(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Create a new user
export async function createUser(name: string, email: string, passwordHash: string) {
  try {
    // Changed: Format date as YYYY-MM-DD instead of ISO string for Cosmic date field
    const createdDate = formatDateForCosmic(new Date())
    
    console.log('Creating user with:', { 
      name, 
      email, 
      hasPassword: !!passwordHash,
      createdDate 
    })
    
    const response = await cosmic.objects.insertOne({
      title: name,
      type: 'users',
      metadata: {
        name,
        email,
        password_hash: passwordHash,
        created_date: createdDate // Changed: Use YYYY-MM-DD format
      }
    })
    
    console.log('User created successfully:', response.object.id)
    return response.object
  } catch (error) {
    // Enhanced error logging with full error details
    console.error('Failed to create user - Full error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name,
      email
    })
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: {
  name?: string
  profile_image?: string
}) {
  try {
    const response = await cosmic.objects.updateOne(userId, {
      metadata: updates
    })
    
    return response.object
  } catch (error) {
    throw new Error('Failed to update user profile')
  }
}

// Update last login time
export async function updateLastLogin(userId: string) {
  try {
    // Changed: Format date as YYYY-MM-DD for Cosmic date field
    const lastLoginDate = formatDateForCosmic(new Date())
    
    await cosmic.objects.updateOne(userId, {
      metadata: {
        last_login: lastLoginDate // Changed: Use YYYY-MM-DD format
      }
    })
  } catch (error) {
    console.error('Failed to update last login:', error)
  }
}

// Blog functions

// Get all articles with pagination
export async function getArticles(page: number = 1, limit: number = 9) {
  try {
    const skip = (page - 1) * limit
    const response = await cosmic.objects
      .find({ type: 'articles' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail', 'created_at'])
      .depth(1)
    
    // Sort by published_date descending (newest first)
    const sortedArticles = response.objects.sort((a: any, b: any) => {
      const dateA = new Date(a.metadata?.published_date || a.created_at).getTime()
      const dateB = new Date(b.metadata?.published_date || b.created_at).getTime()
      return dateB - dateA
    })
    
    // Manual pagination
    const paginatedArticles = sortedArticles.slice(skip, skip + limit)
    
    return {
      articles: paginatedArticles,
      total: sortedArticles.length,
      page,
      totalPages: Math.ceil(sortedArticles.length / limit)
    }
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return { articles: [], total: 0, page: 1, totalPages: 0 }
    }
    throw new Error('Failed to fetch articles')
  }
}

// Get a single article by slug
export async function getArticle(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'articles', slug })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail', 'created_at'])
      .depth(1)
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch article')
  }
}

// Get featured articles
export async function getFeaturedArticles(limit: number = 3) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'articles',
        'metadata.featured': true 
      })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail', 'created_at'])
      .depth(1)
    
    // Sort by published_date descending
    const sortedArticles = response.objects.sort((a: any, b: any) => {
      const dateA = new Date(a.metadata?.published_date || a.created_at).getTime()
      const dateB = new Date(b.metadata?.published_date || b.created_at).getTime()
      return dateB - dateA
    })
    
    return sortedArticles.slice(0, limit)
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch featured articles')
  }
}

// Get articles by category
export async function getArticlesByCategory(categoryId: string, page: number = 1, limit: number = 9) {
  try {
    const skip = (page - 1) * limit
    const response = await cosmic.objects
      .find({ 
        type: 'articles',
        'metadata.category': categoryId 
      })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail', 'created_at'])
      .depth(1)
    
    // Sort by published_date descending
    const sortedArticles = response.objects.sort((a: any, b: any) => {
      const dateA = new Date(a.metadata?.published_date || a.created_at).getTime()
      const dateB = new Date(b.metadata?.published_date || b.created_at).getTime()
      return dateB - dateA
    })
    
    const paginatedArticles = sortedArticles.slice(skip, skip + limit)
    
    return {
      articles: paginatedArticles,
      total: sortedArticles.length,
      page,
      totalPages: Math.ceil(sortedArticles.length / limit)
    }
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return { articles: [], total: 0, page: 1, totalPages: 0 }
    }
    throw new Error('Failed to fetch articles by category')
  }
}

// Get articles by tag
export async function getArticlesByTag(tagId: string, page: number = 1, limit: number = 9) {
  try {
    const skip = (page - 1) * limit
    const response = await cosmic.objects
      .find({ 
        type: 'articles',
        'metadata.tags': tagId 
      })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail', 'created_at'])
      .depth(1)
    
    // Sort by published_date descending
    const sortedArticles = response.objects.sort((a: any, b: any) => {
      const dateA = new Date(a.metadata?.published_date || a.created_at).getTime()
      const dateB = new Date(b.metadata?.published_date || b.created_at).getTime()
      return dateB - dateA
    })
    
    const paginatedArticles = sortedArticles.slice(skip, skip + limit)
    
    return {
      articles: paginatedArticles,
      total: sortedArticles.length,
      page,
      totalPages: Math.ceil(sortedArticles.length / limit)
    }
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return { articles: [], total: 0, page: 1, totalPages: 0 }
    }
    throw new Error('Failed to fetch articles by tag')
  }
}

// Get articles by author
export async function getArticlesByAuthor(authorId: string, page: number = 1, limit: number = 9) {
  try {
    const skip = (page - 1) * limit
    const response = await cosmic.objects
      .find({ 
        type: 'articles',
        'metadata.author': authorId 
      })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail', 'created_at'])
      .depth(1)
    
    // Sort by published_date descending
    const sortedArticles = response.objects.sort((a: any, b: any) => {
      const dateA = new Date(a.metadata?.published_date || a.created_at).getTime()
      const dateB = new Date(b.metadata?.published_date || b.created_at).getTime()
      return dateB - dateA
    })
    
    const paginatedArticles = sortedArticles.slice(skip, skip + limit)
    
    return {
      articles: paginatedArticles,
      total: sortedArticles.length,
      page,
      totalPages: Math.ceil(sortedArticles.length / limit)
    }
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return { articles: [], total: 0, page: 1, totalPages: 0 }
    }
    throw new Error('Failed to fetch articles by author')
  }
}

// Get related articles based on category and tags
export async function getRelatedArticles(articleId: string, categoryId: string, tagIds: string[] = [], limit: number = 3) {
  try {
    const response = await cosmic.objects
      .find({ type: 'articles' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail', 'created_at'])
      .depth(1)
    
    // Filter out current article and score by relevance
    const scoredArticles = response.objects
      .filter((article: any) => article.id !== articleId)
      .map((article: any) => {
        let score = 0
        
        // Same category gets highest score
        if (article.metadata?.category?.id === categoryId) {
          score += 10
        }
        
        // Shared tags get points
        const articleTagIds = article.metadata?.tags?.map((tag: any) => tag.id) || []
        const sharedTags = tagIds.filter(tagId => articleTagIds.includes(tagId))
        score += sharedTags.length * 5
        
        return { article, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
    
    return scoredArticles.slice(0, limit).map(item => item.article)
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch related articles')
  }
}

// Get all categories
export async function getCategories() {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch categories')
  }
}

// Get a single category by slug
export async function getCategory(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'categories', slug })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch category')
  }
}

// Get all tags
export async function getTags() {
  try {
    const response = await cosmic.objects
      .find({ type: 'tags' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch tags')
  }
}

// Get a single tag by slug
export async function getTag(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'tags', slug })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch tag')
  }
}

// Get all authors
export async function getAuthors() {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch authors')
  }
}

// Get a single author by slug
export async function getAuthor(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'authors', slug })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch author')
  }
}