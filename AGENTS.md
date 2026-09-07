# AGENTS.md

Canonical agent notes for this repo. Cursor/Claude files should point here instead of duplicating a second style guide.

## Stack

- React Router 8.3 + React 19, SSR on **Cloudflare Workers**
- Embedded Sanity Studio at `/studio`, visual editing, GROQ + `sanity.types.ts`
- Tailwind CSS v4 + **shadcn/ui** (`base-nova`) + custom `Container`
- ABC Whyte Inktrap from `static/fonts/` (`--font-sans`)
- Biome for format + lint; Vitest for unit tests; `pnpm test:smoke` for Worker smoke
- pnpm (`packageManager`: `pnpm@10.15.0`)

## Commands

- `pnpm dev` — app + embedded Studio (`http://localhost:5173`, Studio at `/studio`)
- `pnpm sanity:dev` — standalone Studio
- `pnpm sanity:types` — schema extract + GROQ typegen → `sanity.types.ts`
- `pnpm typecheck` — Wrangler types, Sanity typegen, React Router typegen, `tsc --noEmit`
- `pnpm check` / `pnpm format` / `pnpm lint` — Biome
- `pnpm test` — Vitest (`tests/**/*.test.ts`)
- `pnpm test:smoke` — build Worker + sample-dataset smoke suite
- `pnpm build` / `pnpm deploy` / `pnpm preview`

After Sanity schema or GROQ changes, run `pnpm typecheck` (or at least `pnpm sanity:types`).

## Import aliases

- `@/…` — anything under `app/` (preferred)
- `@gen/sanity` — generated `sanity.types.ts` (type-only)
- `@root/…` — repo-root runtime imports (e.g. `@root/sanity.config`)
- Exception: React Router route types stay relative (`import type { Route } from './+types/index'`)

## Runtime env

Workers use `nodejs_compat` **and** `nodejs_compat_populate_process_env`. Read server config through `process.env` (see `wrangler.jsonc` `vars` + `.dev.vars` for secrets). Do not put tokens in `wrangler.jsonc`.

## Caching

`wrangler.jsonc` enables Workers Cache. Public document responses send **both**:

- `Cache-Control: public, max-age=0` (browsers)
- `CDN-Cache-Control: public, max-age=60, stale-while-revalidate=300` (Workers Cache)

Preview, Studio, and analytics proxies send `no-store` on **both** headers. Use `app/lib/cache.ts` (`getDocumentCacheHeaders`, `getNoStoreCacheHeaders`, `headersFromLoaderCache`).

## UI

- `app/components/ui/` — primitives (`Container`, shadcn `Button`, `cn()` from `@/lib/utils`)
- `app/components/features/layout|sanity|analytics/` — product UI
- Keep ABC Whyte; do not switch `--font-sans` to Geist
- Site is dark-first: shadcn tokens on `:root` map to the existing palette

## Sanity

- Schema: `app/sanity/schema/`
- Queries: `app/sanity/queries/`
- Typegen: `pnpm sanity:types` → `sanity.types.ts` via `sanity-typegen.json`
- Preview: `/api/preview-mode/enable|disable`, `SANITY_READ_TOKEN` / `SANITY_API_READ_TOKEN`
