import type { Metadata } from "next";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import NewsletterPopup from "@/components/NewsletterPopup";
import CosmicBadge from "@/components/CosmicBadge";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import SocialProofNotification from "@/components/SocialProofNotification";

export const metadata: Metadata = {
  title: "SwagStore - Premium Branded Merchandise & Corporate Swag",
  description: "Shop high-quality branded merchandise, corporate swag, and custom products. Fast shipping, secure checkout, and premium quality guaranteed.",
  keywords: "branded merchandise, corporate swag, custom products, promotional items, company merchandise",
  openGraph: {
    title: "SwagStore - Premium Branded Merchandise",
    description: "Shop high-quality branded merchandise and corporate swag",
    type: "website",
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
      <head>
        <script src="/dashboard-console-capture.js" async></script>
      </head>
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <HeaderWrapper />
            <main>{children}</main>
            <Footer />
            <NewsletterPopup />
            <ExitIntentPopup />
            <SocialProofNotification />
            <CosmicBadge bucketSlug={bucketSlug} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}