import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import NewsletterPopup from '@/components/NewsletterPopup'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import SocialProofNotification from '@/components/SocialProofNotification'
import RecentlyViewedTracker from '@/components/RecentlyViewedTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SwagStore - Premium Merchandise',
  description: 'Shop the latest premium merchandise and apparel',
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
      <body className={inter.className}>
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
            <NewsletterPopup />
            <ExitIntentPopup />
            <SocialProofNotification />
            <RecentlyViewedTracker />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}