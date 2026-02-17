# Arthouse Sanity Starter

React Router v7 + Sanity Studio (embedded) starter.

## 🚀 Tech Stack

- **React Router v7** - Full-stack React framework
- **React 19** - Latest React features
- **TypeScript** - Type safety and better DX
- **Tailwind CSS v4** - Utility-first CSS framework
- **Sanity CMS** - Headless content management system
- **Vite** - Fast development and build tool
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **pnpm** - Fast package manager

## Getting started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

- App: `http://localhost:5173`
- Embedded Studio: `http://localhost:5173/studio`

## Scripts

- `pnpm dev`: app + embedded studio
- `pnpm sanity:dev`: standalone studio (optional)
- `pnpm typecheck`: schema extract + Sanity typegen + React Router typegen + `tsc`
- `pnpm format`: prettier

## Project structure

```
├── app/
│   ├── routes/                         # React Router routes (registered in app/routes.ts)
│   ├── components/
│   │   ├── ui/                         # UI primitives
│   │   └── features/
│   │       ├── layout/                 # header/footer
│   │       ├── sanity/                 # schema-mapped UI + visual editing helpers
│   │       └── analytics/              # consent + tracking gates
│   └── sanity/                         # schema, queries, preview, presentation
├── sanity.config.ts                    # Studio config (embedded at /studio)
├── sanity.types.ts                     # generated Sanity schema + GROQ query types
└── tsconfig.json                       # aliases (@/, @gen/sanity, @root/*)
```

## Styling

Tailwind only. Global CSS is limited to Tailwind v4 `@theme` tokens + minimal base in `app/app.css`.

## Sanity

- Embedded Studio route: `/studio`
- Preview mode routes: `/api/preview-mode/enable` and `/api/preview-mode/disable`
- Type-safe queries: `app/sanity/queries/*` + generated `sanity.types.ts`

## Analytics

Analytics is Sanity-driven (`siteSettings.analytics`) and consent-gated via `@c15t/react`.\nPlausible and PostHog run through proxy routes (`/js/script`, `/api/event`, `/ingest/*`) and are disabled on localhost.

## 🔧 Development

### Code Quality

- **ESLint** - Configured for React and TypeScript
- **Prettier** - Configured with Tailwind CSS plugin for class sorting
- **TypeScript** - Strict mode enabled for better type safety

### React Router 7 Integration

This starter leverages React Router 7's powerful features:

**Server-Side Rendering (SSR):**

- Data loading with `loader` functions
- Automatic hydration and client-side navigation
- SEO-friendly routing with meta tags

**Route Organization:**

- File-based routing in `app/routes/`
- Dynamic routes (e.g., `house.$id.tsx`)
- API routes for backend functionality

**Type Safety:**

- Auto-generated route types
- Type-safe loaders and actions
- Full TypeScript integration

**Performance:**

- Automatic code splitting
- Optimized bundle sizes
- Fast page transitions

## Environment

See `.env.example` for the full list of required variables.

## Starter Placeholders

Search for `change me` and replace all placeholders before shipping.

Places to update:

- `.env.example` deployment defaults
- `public/site.webmanifest` app name, icon paths, and colors

Manifest fields that must be replaced:

- `name`
- `short_name`
- every icon `src`
- `theme_color`
- `background_color`

## 🚢 Deployment

Build the project for production:

```bash
pnpm run build
```

The build artifacts will be stored in the `build/` directory.

### Deployment origin configuration

Use the deployment resolver variables in `.env`:

- `DEPLOYMENT_TARGET` (`custom`, `vercel`, `cloudflare`)
- `DEPLOYMENT_LOCAL_ORIGIN` (optional, runtime fallback defaults to `http://localhost:5173`)
- `DEPLOYMENT_PRODUCTION_ORIGIN` (optional explicit canonical URL)
- `DEPLOYMENT_PREVIEW_ORIGIN` (optional explicit preview override)

Platform-specific vars:

- Vercel: `VERCEL_URL`, `VERCEL_ENV`
- Cloudflare Pages: `CF_PAGES_URL`

Target mode setup:

1. `custom`: set explicit `DEPLOYMENT_PRODUCTION_ORIGIN` and optionally `DEPLOYMENT_PREVIEW_ORIGIN`.
2. `vercel`: set `DEPLOYMENT_TARGET=vercel`, expose `VERCEL_URL` and `VERCEL_ENV`, and optionally override with explicit deployment origins.
3. `cloudflare`: set `DEPLOYMENT_TARGET=cloudflare`, expose `CF_PAGES_URL`, and optionally override with explicit deployment origins.

For Sanity Studio deployment:

```bash
pnpm run sanity:deploy
```

## 📚 Useful Links

- [React Router v7 Documentation](https://reactrouter.com)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
