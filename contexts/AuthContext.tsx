'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'

// Changed: Added AuthResult interface for login/signup return values
interface AuthResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  signup: (name: string, email: string, password: string) => Promise<AuthResult>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  refreshUser: () => Promise<void> // Changed: Added refreshUser method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Changed: Load session from cookie on mount and after navigation
  useEffect(() => {
    refreshSession()
  }, [])

  const refreshSession = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/session')
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to refresh session:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Changed: Added refreshUser as alias for refreshSession
  const refreshUser = refreshSession

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        return { success: false, error: error.error || 'Login failed' }
      }

      const data = await response.json()
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        return { success: false, error: error.error || 'Signup failed' }
      }

      const data = await response.json()
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Signup failed. Please try again.' }
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshSession, refreshUser }}>
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