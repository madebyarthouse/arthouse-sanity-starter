# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm run dev` - Start React Router development server (http://localhost:5173)
- `pnpm run sanity:dev` - Start Sanity Studio development server (http://localhost:3333)
- `pnpm run typecheck` - Run TypeScript type checking and generate Sanity types

### Build & Production

- `pnpm run build` - Build React Router app for production
- `pnpm run start` - Start production server
- `pnpm run sanity:build` - Build Sanity Studio for production
- `pnpm run sanity:deploy` - Deploy Sanity Studio

### Code Quality

- Run ESLint: `pnpm exec eslint .`
- Run Prettier: `pnpm exec prettier . --write`
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
  - `routes/` - Route components (currently home.tsx, api endpoints)
  - `components/` - Reusable React components
  - `lib/` - Utilities (Sanity client, Plausible analytics)
  - `types/` - TypeScript type definitions
  - `root.tsx` - Root layout with error boundaries
- `schemaTypes/` - Sanity schema definitions (currently has house schema)
- `sanity.config.ts` - Sanity Studio configuration with typegen

### Sanity Integration

- Client configured in `app/lib/sanity.ts`
- Type generation from GROQ queries to `app/types/sanity.ts`
- Environment variables: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`
- Sanity Studio runs separately on port 3333

### Key Patterns

- Uses React Router v7 file-based routing with route configuration in `app/routes.ts`
- Server-side rendering enabled by default in `react-router.config.ts`
- Error boundaries implemented in root.tsx with development stack traces
- Plausible analytics integration with custom API routes
- Font loading via Google Fonts (Inter) with preconnect optimization

### Environment Setup

Required environment variables (see .env.example):

- `SANITY_PROJECT_ID` - Sanity project identifier
- `SANITY_DATASET` - Dataset name (e.g., 'production', 'development')
- Optional: `PLAUSIBLE_DOMAIN`, `PRODUCTION_URL` for analytics

### Development Workflow

1. Run both `pnpm run dev` and `pnpm run sanity:dev` for full development
2. Use `pnpm run typecheck` after modifying Sanity schemas to regenerate types
3. Follow .cursorrules for consistent code style (functional components, TypeScript, Tailwind)
4. Package management uses pnpm exclusively
