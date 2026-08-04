# Concerns Handled by Arthouse Sanity Starter

This document summarizes all the concerns handled by this starter kit for websites, content sites, and headless content sites. Concerns are organized by the system that handles them (Sanity CMS vs React Router framework).

## Sanity CMS Concerns

### Content Management

**Content Structure:**
- **Pages** - Dynamic page content with slug-based routing
  - Homepage singleton (special page with ID "homepage")
  - Regular pages with unique slugs
  - Two content modes: Rich Text or Page Builder
  - SEO metadata per page (title, description, keywords, OG image, visibility)
  
- **Page Builder Components** - Modular, composable content blocks
  - Extensible component system for flexible page layouts
  - Currently includes placeholder components (ready for expansion)

- **Rich Text Content** - Portable Text editor
  - Full-featured rich text editing
  - Support for internal/external links
  - Image embedding with complex image handling

**Site Configuration:**
- **Site Settings** (singleton) - Global site configuration
  - SEO settings (meta defaults, OG visuals)
  - Favicon management
  - Social media links
  - Legal page references (privacy policy, imprint)
  - Analytics configuration

- **Theme Settings** (singleton) - Visual theming
  - Brand color customization
  - Background color
  - Text/foreground color
  - CSS custom properties integration

- **Header** (singleton) - Site header/navigation
  - Logo/image branding
  - Navigation menu structure
  - Visual editing support

- **Footer** (singleton) - Site footer
  - Logo/image branding
  - Main navigation links
  - Secondary navigation links
  - Social media links

**Content Types & Objects:**
- **Complex Image** - Advanced image handling
  - Image asset management
  - Alt text and captions
  - Responsive image support

- **Navigation Links** - Reusable navigation structure
  - Internal page references
  - External URLs
  - Link labels and metadata

- **CTA Links** - Call-to-action link objects
  - Reusable link components for CTAs

- **Social Links** - Social media integration
  - Platform-specific social links
  - Icon/visual support

- **Rich Text** - Portable Text content
  - Structured content blocks
  - Inline formatting
  - Link annotations (internal/external)
  - Image embeds

- **Separator** - Visual content dividers

- **Meta Settings** - SEO configuration object
  - Default meta tags
  - Site-wide SEO defaults

### Content Workflow & Editing

**Studio Interface:**
- **Custom Structure Builder** - Organized content navigation
  - Homepage as dedicated singleton
  - Pages list (excluding homepage)
  - Settings section (site, theme, header, footer)
  - Grouped by content type

- **Internationalization (i18n)** - Multi-language Studio support
  - English and German labels
  - Configurable Studio locale
  - Localized field labels and UI

- **Document Groups** - Organized editing experience
  - Content vs SEO groups for pages
  - Branding vs Navigation groups for header/footer
  - General, SEO, Legal, Analytics groups for site settings

**Content Visibility & Access:**
- **Visibility Controls** - Page-level visibility settings
  - Public (indexed by search engines)
  - Hidden (noindex, but accessible)
  - Private (404 response, not accessible)

- **Draft Content Management** - Preview and draft workflows
  - Draft content creation
  - Preview mode for unpublished content
  - Session-based preview authentication

### Visual Editing & Preview

**Visual Editing:**
- **Stega Encoding** - Click-to-edit functionality
  - Data attributes for visual editing
  - Inline editing support
  - Real-time content updates

- **Presentation Mode** - Live preview in Studio
  - Document-to-URL mapping
  - Preview URL configuration
  - Location resolution for pages

- **Preview Mode** - Secure draft preview
  - Session-based authentication
  - Secret URL validation
  - Preview mode enable/disable endpoints

### Analytics & Privacy

**Analytics Configuration:**
- **Analytics Settings** - Comprehensive analytics setup
  - Enable/disable toggle
  - Consent banner configuration (headline, description, button labels)
  - Consent categories (necessary, functionality, etc.)
  - Category-level configuration (key, label, description, required flag)

- **Plausible Analytics** - Privacy-focused analytics
  - Domain configuration
  - Self-hosted URL support
  - Proxy mode (privacy-first, no external requests)
  - Localhost detection and disabling

- **PostHog Analytics** - Product analytics
  - Project key configuration
  - Host URL configuration
  - Proxy mode support
  - Localhost detection and disabling

- **Cookie Consent** - GDPR/privacy compliance
  - Consent management via `@c15t/react`
  - Customizable consent banner
  - Category-based consent tracking
  - Offline mode support

## React Router Framework Concerns

### Routing & Navigation

**File-Based Routing:**
- **Dynamic Routes** - Slug-based page routing
  - `/:slug` dynamic route for pages
  - Automatic 404 handling for missing pages
  - Type-safe route parameters

- **Homepage Route** - Root path handling
  - `/` route for homepage
  - Special handling for homepage singleton

- **API Routes** - Backend functionality
  - `/api/preview-mode/enable` - Preview mode activation
  - `/api/preview-mode/disable` - Preview mode deactivation
  - `/api/event` - Analytics event proxy
  - `/ingest/*` - Analytics ingestion proxy

- **Resource Routes** - Static assets and metadata
  - `/sitemap.xml` - Dynamic sitemap generation
  - `/robots.txt` - Search engine directives
  - `/js/script` - Analytics script proxy

- **Embedded Studio Route** - CMS access
  - `/studio` - Embedded Sanity Studio
  - `/studio/*` - Studio sub-routes

### Server-Side Rendering (SSR)

**Data Loading:**
- **Loader Functions** - Server-side data fetching
  - Type-safe loaders with generated route types
  - Preview mode integration
  - Error handling and 404 responses

- **Server-Side Queries** - Sanity data fetching
  - GROQ query execution on server
  - Preview drafts perspective support
  - Type-safe query results

- **Hydration** - Client-side state management
  - Automatic hydration of server data
  - Real-time updates with `useQuery` hook
  - Optimistic UI updates

**Meta Tags & SEO:**
- **Dynamic Meta Tags** - Per-page SEO
  - Title generation (page title + site name)
  - Meta descriptions
  - Robots directives (index/noindex based on visibility)
  - Open Graph image support

- **Sitemap Generation** - Dynamic XML sitemap
  - All public pages included
  - Last modified dates
  - Proper XML escaping
  - Cache headers for performance

- **Robots.txt** - Search engine directives
  - Studio and API route blocking
  - Sitemap reference
  - Dynamic generation

### Performance & Optimization

**Code Splitting:**
- Automatic route-based code splitting
- Lazy loading of components
- Optimized bundle sizes

**Font Loading:**
- Google Fonts integration (Inter)
- Preconnect for performance
- Display swap for better UX

**Caching:**
- Sitemap caching (5 minutes)
- Robots.txt caching (5 minutes)
- Static asset optimization

### Error Handling

**Error Boundaries:**
- Route-level error boundaries
- Development stack traces
- User-friendly error messages
- 404 handling for missing pages

**Preview Mode Errors:**
- Invalid secret handling
- Missing token errors
- Session validation

### Type Safety

**Generated Types:**
- React Router route types (auto-generated)
- Sanity schema types (from schema + queries)
- Type-safe loaders and actions
- Type-safe query results

**TypeScript Integration:**
- Strict mode enabled
- Import aliases (`@/`, `@gen/sanity`, `@root/`)
- Type-only imports for generated types

## Cross-Cutting Concerns

### Content Delivery

**Headless Architecture:**
- Decoupled content and presentation
- API-first content delivery
- Multiple frontend support potential

**Real-Time Updates:**
- Live content updates via `useQuery`
- Visual editing with instant preview
- Draft content preview

### Developer Experience

**Development Workflow:**
- Hot module replacement
- Type generation on schema/query changes
- Embedded Studio for seamless editing
- Preview mode for content review

**Code Quality:**
- Biome configuration and formatting
- TypeScript strict mode
- Consistent import patterns

### Styling & Theming

**Tailwind CSS v4:**
- Utility-first styling
- Theme customization via CSS variables
- Responsive design utilities
- Global theme tokens in `app.css`

**Dynamic Theming:**
- Runtime theme color changes
- CSS custom properties integration
- Brand color customization
- Background/foreground color management

### Security

**Preview Mode Security:**
- Secret URL validation
- Session-based authentication
- Token-based access control
- Secure cookie handling

**Analytics Privacy:**
- Proxy mode for analytics (no external requests)
- Localhost detection and disabling
- Consent-based tracking
- GDPR-compliant cookie handling

### Internationalization

**Content i18n:**
- Multi-language Studio labels (en/de)
- Configurable locale
- Localized field labels

**Note:** Content-level i18n (multi-language content) is not currently implemented, but the infrastructure exists for expansion.

## Summary

This starter kit provides a comprehensive foundation for headless content sites, handling:

- **Content Management**: Full CMS capabilities with structured content types, page builder, and rich text editing
- **SEO & Discoverability**: Dynamic meta tags, sitemaps, robots.txt, and visibility controls
- **Performance**: SSR, code splitting, optimized loading, and caching
- **Developer Experience**: Type safety, hot reloading, embedded Studio, and preview mode
- **Privacy & Compliance**: Cookie consent, analytics proxies, and GDPR considerations
- **Visual Editing**: Click-to-edit, live preview, and draft content workflows
- **Theming**: Dynamic color customization and CSS variable integration
- **Routing**: File-based routing with dynamic pages, API routes, and resource routes

The architecture cleanly separates concerns: Sanity handles content management and editing workflows, while React Router handles routing, SSR, performance, and SEO delivery.
