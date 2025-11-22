import './globals.css'
import type { Metadata } from 'next'
import { HeaderWrapper } from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import CosmicBadge from '@/components/CosmicBadge'

export const metadata: Metadata = {
  title: 'SwagStore - Premium Merchandise',
  description: 'Shop premium merchandise and swag',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛍️</text></svg>',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <CartProvider>
            <HeaderWrapper />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <CosmicBadge bucketSlug={bucketSlug} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}