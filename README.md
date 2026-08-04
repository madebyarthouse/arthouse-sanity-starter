# Sanity Starter

React Router 8 + embedded Sanity Studio starter with a Cloudflare Workers
deployment target.

## 🚀 Tech Stack

- **React Router v8** - Full-stack React framework
- **React 19** - Latest React features
- **TypeScript** - Type safety and better DX
- **Tailwind CSS v4** - Utility-first CSS framework
- **Sanity CMS** - Headless content management system
- **Vite** - Fast development and build tool
- **Cloudflare Workers** - SSR runtime with Workers Cache
- **Biome** - Code formatting and linting
- **pnpm** - Fast package manager

## Getting started

### Prerequisites

- Node.js 22.22+
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
- `pnpm typecheck`: Wrangler, schema, Sanity, React Router typegen + `tsc`
- `pnpm format`: Biome formatting
- `pnpm format:check`: check Biome formatting
- `pnpm lint`: Biome linting
- `pnpm check`: Biome formatting and lint checks
- `pnpm test:smoke`: offline Worker smoke tests for the homepage and Studio
- `pnpm deploy`: production build and `wrangler deploy`
- `pnpm preview`: build and run the Worker locally with Wrangler

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

Analytics is Sanity-driven (`siteSettings.analytics`) and consent-gated via
`@c15t/react`. Plausible and PostHog run through proxy routes (`/js/script`,
`/api/event`, `/ingest/*`) and are disabled on localhost.

## 🔧 Development

### Code Quality

- **Biome** - Configured for formatting and linting
- **TypeScript** - Strict mode enabled for better type safety

### React Router 8 Integration

This starter leverages React Router 8's server-rendered route modules and typed
loaders:

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

## CI smoke tests

The GitHub Actions workflow runs `pnpm check` and `pnpm test:smoke` on every
push and pull request. The smoke suite builds the Worker with a sample Sanity
dataset fixture, verifies the homepage output, and checks that the configured
Studio route renders without an SSR error.

## 🚢 Deployment

Build the project for production:

```bash
pnpm run build
```

The build artifacts will be stored in the `build/` directory.

For Sanity Studio deployment:

```bash
pnpm run sanity:deploy
```

### Cloudflare

Edit the non-secret target values in `wrangler.jsonc`. Do not put tokens or
session secrets there. Copy `.dev.vars.example` to `.dev.vars` for local Worker
development, and set the same secrets in Cloudflare Variables & Secrets for a
deployment. `nodejs_compat` is enabled because the starter reads server config
through `process.env`.

Workers Cache is enabled in Wrangler. Public document responses use a short
60-second edge TTL with five-minute stale-while-revalidate; preview and proxy
responses are `no-store`. Cache-tag purging is intentionally not claimed until
a Cloudflare-specific revalidation adapter is added.

## 📚 Useful Links

- [React Router v8 Documentation](https://reactrouter.com)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
