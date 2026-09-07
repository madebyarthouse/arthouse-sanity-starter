# Sanity Starter

React Router 8 + embedded Sanity Studio starter with a Cloudflare Workers
deployment target.

## Tech Stack

- **React Router v8** — full-stack React framework
- **React 19** — latest React features
- **TypeScript** — type safety and better DX
- **Tailwind CSS v4** — utility-first CSS
- **shadcn/ui** — `base-nova` primitives (`Button`, `cn()`)
- **Sanity CMS** — headless content management
- **Vite** — development and Worker build
- **Cloudflare Workers** — SSR runtime with Workers Cache
- **Biome** — formatting and linting
- **Vitest** — unit tests (`pnpm test`)
- **pnpm** — package manager (`pnpm@10.15.0`)

## Getting started

### Prerequisites

- Node.js 22.22+
- pnpm 10.15.0 (`packageManager` in `package.json`)

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
- `pnpm format` / `pnpm format:check` / `pnpm lint` / `pnpm check`: Biome
- `pnpm test`: Vitest unit tests (`app/lib/cache.ts`, `cn()`, …)
- `pnpm test:smoke`: offline Worker smoke tests for the homepage and Studio
- `pnpm deploy`: production build and `wrangler deploy`
- `pnpm preview`: build and run the Worker locally with Wrangler

## Project structure

```
├── app/
│   ├── routes/                         # React Router routes (registered in app/routes.ts)
│   ├── components/
│   │   ├── ui/                         # UI primitives (Container, shadcn Button)
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

Tailwind v4 + shadcn (`base-nova`). Global CSS in `app/app.css` holds `@theme`
tokens, ABC Whyte `@font-face` from `static/fonts/`, and shadcn variables mapped
onto the dark Arthouse palette. `--font-sans` stays ABC Whyte Inktrap.

Add components with:

```bash
pnpm dlx shadcn@latest add <component>
```

## Sanity

- Embedded Studio route: `/studio`
- Preview mode routes: `/api/preview-mode/enable` and `/api/preview-mode/disable`
- Type-safe queries: `app/sanity/queries/*` + generated `sanity.types.ts`

## Analytics

Analytics is Sanity-driven (`siteSettings.analytics`) and consent-gated via
`@c15t/react`. Plausible and PostHog run through proxy routes (`/js/script`,
`/api/event`, `/ingest/*`) and are disabled on localhost.

## Environment

See `.env.example` for the full list of required variables.

## CI

GitHub Actions runs on [Blacksmith](https://blacksmith.sh/) (`blacksmith-4vcpu-ubuntu-2204`):
Biome `check`, `typecheck`, Vitest, Worker smoke tests, and production build
on pull requests and pushes to `main`.

## Deployment

```bash
pnpm run build
```

Build artifacts land in `build/`. Optional standalone Studio deploy:

```bash
pnpm run sanity:deploy
```

### Cloudflare

Edit non-secret target values in `wrangler.jsonc`. Do not put tokens or session
secrets there. Copy `.dev.vars.example` to `.dev.vars` for local Worker
development, and set the same secrets in Cloudflare Variables & Secrets for a
deployment.

`nodejs_compat` and `nodejs_compat_populate_process_env` are enabled so the
starter can read server config through `process.env`.

Workers Cache is enabled. Public document responses send **both**:

- `Cache-Control: public, max-age=0` (browsers always revalidate)
- `CDN-Cache-Control: public, max-age=60, stale-while-revalidate=300` (Workers Cache)

Preview, Studio, and analytics proxy responses are `no-store` on both headers.
Helpers live in `app/lib/cache.ts`. Cache-tag purging is not claimed until a
Cloudflare-specific revalidation adapter is added.

## Useful links

- [React Router v8](https://reactrouter.com)
- [Sanity](https://www.sanity.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## License

MIT
