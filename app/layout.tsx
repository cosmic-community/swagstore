import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import SocialProofNotification from '@/components/SocialProofNotification'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import NewsletterPopup from '@/components/NewsletterPopup'
import RecentlyViewedTracker from '@/components/RecentlyViewedTracker'

export const metadata: Metadata = {
  title: 'SwagStore - Premium Swag & Merchandise',
  description: 'Discover premium branded merchandise and swag for your team',
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
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <HeaderWrapper />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <CosmicBadge bucketSlug={bucketSlug} />
            <SocialProofNotification />
            <ExitIntentPopup />
            <NewsletterPopup />
            <RecentlyViewedTracker />
          </CartProvider>
        </AuthProvider>
        <script src="/dashboard-console-capture.js" async />
      </body>
    </html>
  )
}