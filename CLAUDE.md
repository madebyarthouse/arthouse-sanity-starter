# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm run dev` - Start React Router development server with embedded Sanity Studio (http://localhost:5173)
  - React app available at http://localhost:5173
  - Sanity Studio available at http://localhost:5173/studio
- `pnpm run typecheck` - Run TypeScript type checking and React Router typegen
  - Note: this script runs `sanity:types` (schema extract + typegen) first

### Build & Production

- `pnpm run build` - Build React Router app for production (includes Sanity Studio)
- `pnpm run start` - Start production server
- `pnpm run rr:typegen` - Generate React Router types
- `pnpm run sanity:dev` - Run Sanity Studio dev server (standalone)
- `pnpm run sanity:types` - Regenerate `sanity.types.ts` from schema + GROQ queries

### Code Quality

- `pnpm run format` - Run Prettier formatting
- Run ESLint: `pnpm exec eslint .`
- TypeScript compilation: `tsc --noEmit`

## Architecture

### Core Stack

- **React Router v7** with server-side rendering enabled
- **React 19** with modern patterns and hooks
- **Sanity CMS** for headless content management
- **Tailwind CSS v4** for utility-first styling
- **TypeScript** with strict type checking

### Project Structure

- `app/` - React Router application with file-based routing
  - `routes/` - Route components (home.tsx, house.$id.tsx, api endpoints)
    - `api/preview-mode/` - Preview mode enable/disable endpoints
    - `studio.$.tsx` - Embedded Sanity Studio route
  - `components/` - UI + feature components
    - `components/ui/` - Generic UI primitives (e.g. `Container`)
    - `components/features/layout/` - App chrome (`Header`, `Footer`)
    - `components/features/sanity/` - Components that map to Sanity schema (PortableText, images, links, visual editing)
    - `components/features/analytics/` - Analytics/consent feature (ART-365)
  - `lib/` - Utilities (Sanity client, Plausible analytics)
  - `sanity/` - Sanity integration
    - `schema/` - Sanity schema definitions (house.ts, index.ts)
    - `loader.server.ts` - Server-side data loading
    - `preview.ts` - Preview mode and session management
    - `project-details.ts` - Environment variable handling
    - `types.ts` - Generated TypeScript types from Sanity
  - `root.tsx` - Root layout with SSR and visual editing
- `sanity.config.ts` - Sanity Studio configuration with embedded routing
- `sanity.cli.ts` - Sanity CLI configuration

### Import aliases (required)

- Use `@/…` for anything under `app/` (preferred app-root alias).
- Use `@gen/sanity` for the generated `sanity.types.ts` import (type-only).
- Use `@root/…` for repo-root files when needed at runtime (e.g. `@root/sanity.config`).
- **Exception**: keep React Router route type imports relative, e.g. `import type { Route } from './+types/foo'` (those are generated virtual modules).

### Sanity Integration

**Core Setup:**

- Client configured in `app/lib/sanity.ts` with stega support
- Embedded Studio accessible at `/studio` route
- Server-side data loading with `@sanity/react-loader`
- Generated TypeScript types in `app/sanity/types.ts`

**Visual Editing & Preview:**

- Live visual editing with `@sanity/visual-editing`
- Preview mode with secure session management
- Draft content preview with `perspective: 'previewDrafts'`
- Click-to-edit functionality with stega encoding

**Environment Variables:**

- `VITE_SANITY_PROJECT_ID` - Project identifier (required)
- `VITE_SANITY_DATASET` - Dataset name (required)
- `VITE_SANITY_API_VERSION` - API version (defaults to 2024-02-13)
- `VITE_SANITY_STUDIO_URL` - Studio URL for visual editing
- `SANITY_READ_TOKEN` - Server-side token for preview mode

### Key Patterns

**React Router v7:**

- File-based routing with TypeScript route types
- Server-side rendering with data loaders
- Dynamic routes (e.g., `house.$id.tsx`)
- API routes for backend functionality
- Error boundaries with development stack traces

**Sanity CMS:**

- Embedded Studio route (`studio.$.tsx`)
- Visual editing with stega data attributes
- Preview mode with session-based authentication
- Real-time content updates with `useQuery` hook
- Type-safe GROQ queries with generated types

**Performance & UX:**

- Automatic code splitting and hydration
- Font loading optimization (Inter via Google Fonts)
- Tailwind CSS for utility-first styling
- ESLint + Prettier for code quality

### Environment Setup

Required environment variables:

**Public (browser-accessible):**

- `VITE_SANITY_PROJECT_ID` - Sanity project identifier
- `VITE_SANITY_DATASET` - Dataset name (e.g., 'production', 'development')
- `VITE_SANITY_API_VERSION` - API version (optional, defaults to 2024-02-13)
- `VITE_SANITY_STUDIO_URL` - Studio URL for visual editing

**Private (server-only):**

- `SANITY_READ_TOKEN` - Read token for preview mode access

**Optional:**

- `VITE_SANITY_STUDIO_PREVIEW_ORIGIN` - Production domain for studio previews

### Development Workflow

1. Run `pnpm run dev` to start both React app and embedded Sanity Studio
   - React app: http://localhost:5173
   - Sanity Studio: http://localhost:5173/studio
2. After modifying Sanity schemas or GROQ queries, run `pnpm run typecheck` (regenerates `sanity.types.ts` and route types)
3. Access preview mode via Studio's "Open preview" feature
4. Prefer Tailwind utility classes; keep global CSS limited to `app/app.css` tokens/base.
5. Follow `.cursorrules` for consistent imports and structure
6. Package management uses pnpm exclusively
