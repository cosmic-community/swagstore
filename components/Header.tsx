'use client'

import { useState } from 'react'
import { Collection } from '@/types'
import CartButton from '@/components/CartButton'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  collections: Collection[]
}

export default function Header({ collections }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">SwagStore</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="/products"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Products
            </a>
            
            {/* Collections Dropdown */}
            {collections.length > 0 && (
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                  Collections
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {collections.map((collection) => (
                      <a
                        key={collection.id}
                        href={`/collections/${collection.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {collection.metadata.collection_name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart, User Menu, and Mobile Menu */}
          <div className="flex items-center gap-4">
            <CartButton />
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden md:inline">{user.metadata.name}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                    <div className="py-2">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="hidden md:inline-block text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </a>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/products"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </a>
              
              {/* Mobile Collections Dropdown */}
              {collections.length > 0 && (
                <div>
                  <button
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 px-2 py-1 w-full text-left"
                    onClick={() => setCollectionsOpen(!collectionsOpen)}
                  >
                    Collections
                    <svg 
                      className={`w-4 h-4 transition-transform ${collectionsOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {collectionsOpen && (
                    <div className="mt-2 ml-4 space-y-2">
                      {collections.map((collection) => (
                        <a
                          key={collection.id}
                          href={`/collections/${collection.slug}`}
                          className="block px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setCollectionsOpen(false)
                          }}
                        >
                          {collection.metadata.collection_name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Mobile User Menu */}
              {user ? (
                <>
                  <a
                    href="/profile"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}