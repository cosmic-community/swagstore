import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwagStore - Premium Branded Merchandise",
  description: "Shop the latest in premium branded merchandise and swag",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛍️</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <HeaderWrapper />
              <main className="flex-grow">{children}</main>
              <Footer />
              <CosmicBadge bucketSlug={bucketSlug} />
              <NewsletterPopup />
              <ExitIntentPopup />
              <SocialProofNotification />
              <RecentlyViewedTracker />
            </div>
          </CartProvider>
        </AuthProvider>
        <script src="/dashboard-console-capture.js" />
      </body>
    </html>
  );
}