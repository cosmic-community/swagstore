'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Cart, CartItem, getCart, addToCart as addToCartUtil, removeFromCart as removeFromCartUtil, updateQuantity as updateQuantityUtil, clearCart as clearCartUtil, getCartItemCount } from '@/lib/cart'
import { Product } from '@/types'

interface CartContextType {
  cart: Cart
  items: CartItem[]
  addToCart: (product: Product, quantity?: number, size?: string) => void
  removeFromCart: (productId: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 })
  const [itemCount, setItemCount] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getCart()
    setCart(savedCart)
    setItemCount(getCartItemCount(savedCart))
  }, [])

  const addToCart = (product: Product, quantity: number = 1, size?: string) => {
    const newCart = addToCartUtil(cart, product, quantity, size)
    setCart(newCart)
    setItemCount(getCartItemCount(newCart))
  }

  const removeFromCart = (productId: string, size?: string) => {
    const newCart = removeFromCartUtil(cart, productId, size)
    setCart(newCart)
    setItemCount(getCartItemCount(newCart))
  }

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    const newCart = updateQuantityUtil(cart, productId, quantity, size)
    setCart(newCart)
    setItemCount(getCartItemCount(newCart))
  }

  const clearCart = () => {
    const newCart = clearCartUtil()
    setCart(newCart)
    setItemCount(0)
  }

  return (
    <CartContext.Provider value={{ cart, items: cart.items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}