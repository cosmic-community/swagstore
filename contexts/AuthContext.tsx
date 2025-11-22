'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Failed to check session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        return { success: true }
      }

      return { success: false, error: data.error || 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An error occurred during login' }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        return { success: true }
      }

      return { success: false, error: data.error || 'Signup failed' }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'An error occurred during signup' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}