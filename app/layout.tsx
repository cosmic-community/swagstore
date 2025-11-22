import type { Metadata } from 'next'
import './globals.css'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://swagstore.com'),
  title: 'SwagStore - Premium Branded Merchandise',
  description: 'Shop our collection of premium branded apparel and accessories. High-quality products for your business and personal use.',
  keywords: ['branded merchandise', 'swag', 'apparel', 'business gifts', 'promotional products'],
  authors: [{ name: 'SwagStore' }],
  openGraph: {
    title: 'SwagStore - Premium Branded Merchandise',
    description: 'Shop our collection of premium branded apparel and accessories',
    type: 'website',
    locale: 'en_US',
    siteName: 'SwagStore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SwagStore - Premium Branded Merchandise',
    description: 'Shop our collection of premium branded apparel and accessories',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛍️</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <HeaderWrapper />
            <main className="min-h-screen">
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