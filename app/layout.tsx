import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import CosmicBadge from "@/components/CosmicBadge";
import NewsletterPopup from "@/components/NewsletterPopup";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import SocialProofNotification from "@/components/SocialProofNotification";
import RecentlyViewedTracker from "@/components/RecentlyViewedTracker";

export const metadata: Metadata = {
  title: "SwagStore - Premium Swag & Merchandise",
  description: "Discover premium swag and merchandise for your brand",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛍️</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <HeaderWrapper />
              <main className="flex-grow">{children}</main>
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
  );
}