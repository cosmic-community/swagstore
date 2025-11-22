# SwagStore - Modern E-Commerce Showcase

![App Preview](https://imgix.cosmicjs.com/77e07900-c756-11f0-885f-6dd039c126d9-photo-1523381210434-271e8be1f52b-1763783463854.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A modern, responsive e-commerce showcase application for displaying branded merchandise with product catalogs, collections, and customer reviews.

## Features

- 🛍️ Dynamic product catalog with detailed product pages
- 🏷️ Collection-based product filtering (Apparel, Accessories)
- ⭐ Customer reviews with star ratings and verified purchase indicators
- 📱 Fully responsive mobile-first design
- 🖼️ Product image galleries with imgix optimization
- 🎨 Modern UI with Tailwind CSS
- ⚡ Server-side rendering with Next.js 16
- 🔒 Type-safe with TypeScript

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=692132ca0666235fdb0663e3&clone_repository=692134300666235fdb066404)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Design a content model for an e-commerce swag store with products, collections, and customer reviews"

### Code Generation Prompt

> Based on the content model I created for "Design a content model for an e-commerce swag store with products, collections, and customer reviews", now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic SDK** - Content management integration
- **React 19** - Latest React features
- **Bun** - Fast package management and runtime

## Getting Started

### Prerequisites

- Node.js 18+ or Bun installed
- A Cosmic account with bucket credentials

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Create a `.env.local` file with your Cosmic credentials:

```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:

```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Products

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all products with collection data
const { objects: products } = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Get a single product by slug
const { object: product } = await cosmic.objects
  .findOne({ type: 'products', slug: 'classic-logo-tshirt' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching Collections

```typescript
// Get all collections
const { objects: collections } = await cosmic.objects
  .find({ type: 'collections' })
  .props(['id', 'title', 'slug', 'metadata'])
```

### Fetching Reviews

```typescript
// Get reviews for a specific product
const { objects: reviews } = await cosmic.objects
  .find({ 
    type: 'reviews',
    'metadata.product': productId 
  })
  .props(['id', 'title', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This application integrates with three Cosmic object types:

### Products
- Product name, description, and pricing
- Multiple product images with imgix optimization
- SKU and stock quantity tracking
- Size availability (XS, S, M, L, XL, XXL)
- Featured product flag
- Collection relationship

### Collections
- Collection name and description
- Banner images for collection pages
- Display order for sorting
- Products are linked to collections

### Reviews
- Product relationship (which product is being reviewed)
- Star rating (1-5 stars)
- Review title and content
- Reviewer name
- Verified purchase indicator
- Review date

## Deployment Options

### Deploy to Vercel

The easiest way to deploy this Next.js app:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Connect your GitHub repository
3. Add environment variables:
   - `COSMIC_BUCKET_SLUG`
   - `COSMIC_READ_KEY`
   - `COSMIC_WRITE_KEY`
4. Deploy!

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy!

## Project Structure

```
├── app/
│   ├── collections/[slug]/     # Collection pages
│   ├── products/[slug]/        # Individual product pages
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/
│   ├── ProductCard.tsx         # Product display card
│   ├── CollectionCard.tsx      # Collection display card
│   ├── ReviewCard.tsx          # Review display card
│   ├── Header.tsx              # Site header/navigation
│   ├── Footer.tsx              # Site footer
│   └── CosmicBadge.tsx         # Built with Cosmic badge
├── lib/
│   └── cosmic.ts               # Cosmic SDK configuration
├── types.ts                    # TypeScript type definitions
└── public/
    └── dashboard-console-capture.js  # Console logging for dashboard
```

<!-- README_END -->