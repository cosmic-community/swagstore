import { Product } from '@/types'

export interface CartItem {
  product: Product
  quantity: number
  size?: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

const CART_STORAGE_KEY = 'swagstore_cart'

// Get cart from localStorage
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 }
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const cart = JSON.parse(stored) as Cart
      return cart
    }
  } catch (error) {
    console.error('Failed to load cart:', error)
  }

  return { items: [], total: 0 }
}

// Save cart to localStorage
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart:', error)
  }
}

// Calculate cart total
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.product.metadata.price * item.quantity)
  }, 0)
}

// Add item to cart
export function addToCart(cart: Cart, product: Product, quantity: number = 1, size?: string): Cart {
  const existingItemIndex = cart.items.findIndex(
    item => item.product.id === product.id && item.size === size
  )

  let newItems: CartItem[]

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    newItems = cart.items.map((item, index) => {
      if (index === existingItemIndex) {
        return {
          ...item,
          quantity: item.quantity + quantity
        }
      }
      return item
    })
  } else {
    // Add new item
    newItems = [
      ...cart.items,
      {
        product,
        quantity,
        size
      }
    ]
  }

  const newCart = {
    items: newItems,
    total: calculateTotal(newItems)
  }

  saveCart(newCart)
  return newCart
}

// Remove item from cart
export function removeFromCart(cart: Cart, productId: string, size?: string): Cart {
  const newItems = cart.items.filter(
    item => !(item.product.id === productId && item.size === size)
  )

  const newCart = {
    items: newItems,
    total: calculateTotal(newItems)
  }

  saveCart(newCart)
  return newCart
}

// Update item quantity
export function updateQuantity(cart: Cart, productId: string, quantity: number, size?: string): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, productId, size)
  }

  const newItems = cart.items.map(item => {
    if (item.product.id === productId && item.size === size) {
      return {
        ...item,
        quantity
      }
    }
    return item
  })

  const newCart = {
    items: newItems,
    total: calculateTotal(newItems)
  }

  saveCart(newCart)
  return newCart
}

// Clear entire cart
export function clearCart(): Cart {
  const emptyCart = { items: [], total: 0 }
  saveCart(emptyCart)
  return emptyCart
}

// Get cart item count
export function getCartItemCount(cart: Cart): number {
  return cart.items.reduce((count, item) => count + item.quantity, 0)
}