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

// Create a new user
export async function createUser(name: string, email: string, passwordHash: string) {
  try {
    const response = await cosmic.objects.insertOne({
      title: name,
      type: 'users',
      metadata: {
        name,
        email,
        password_hash: passwordHash,
        created_date: new Date().toISOString()
      }
    })
    
    return response.object
  } catch (error) {
    throw new Error('Failed to create user')
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
    await cosmic.objects.updateOne(userId, {
      metadata: {
        last_login: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Failed to update last login:', error)
  }
}