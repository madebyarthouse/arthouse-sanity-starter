## ART-356: Refine `arthouse-sanity-starter`

- **Linear**: `https://linear.app/arthouse/issue/ART-356/refine-arthouse-sanity-starter`
- **Goal**: Turn the repo into a repeatable “golden path” starter that ships the refined Sanity integration and base feature set (schemas, queries, typegen, preview, SEO, analytics, consent).

### Objective
- Integrate outputs from ART-357..365 into a cohesive starter:
  - Schema + structure builder
  - Query layer + TypeGen
  - Presentation mode / visual editing
  - UI primitives (rich text, links, images)
  - SEO routes + visibility semantics
  - Analytics + cookie consent
  - Env + docs
- Remove demo “house” content and any temporary/testing-only code paths.

### In scope (explicit)
- Remove demo schema/routes and align README/docs to new content model.
- Ensure the starter runs end-to-end on a fresh clone:
  - `pnpm install`
  - copy `.env.example` → `.env`
  - `pnpm dev` + `pnpm sanity:dev`
  - `pnpm sanity:types`

### Out of scope
- Customer-specific schemas (articles/magazine) beyond what is in ART-357.
- Design-polished front-end; starter should be minimal but correct.

### Dependencies
- ART-357 Schema Foundation
- ART-358 Query Layer
- ART-359 TypeGen Setup
- ART-360 Structure Builder
- ART-361 Presentation Mode
- ART-362 UI Components
- ART-363 SEO Routes
- ART-365 Analytics & Cookie Consent
- ART-364 Env & Documentation

### Code touch points (expected high-level)
- Remove demo:
  - `app/sanity/schema/house.ts`
  - `app/routes/home.tsx` and `app/routes/house.$id.tsx`
  - `app/routes.ts` entries related to houses
- Add core routes:
  - Homepage route module (index)
  - `/:slug` page route module
  - `sitemap.xml`, `robots.txt` routes
  - Ensure analytics proxy routes are registered
- Add site layout wiring:
  - Load `siteSettings/header/footer/themeSettings` in a site layout loader
  - Render basic header/footer and apply theme tokens

### Implementation plan (step-by-step)
1. **Remove demo content**
   - Delete or stop exporting `house` schema.
   - Remove “houses” pages/routes.
   - Update README “sample schema” section to reflect new schemas.

2. **Implement core site routes**
   - Homepage (`/`):
     - Loader uses `HOMEPAGE_QUERY` and `loadQuery<T>`.
     - Render either `richText` or `components[]` depending on `contentMode`.
   - Page (`/:slug`):
     - Loader uses `PAGE_QUERY` and enforces:
       - slug not found → 404
       - `meta.visibility === 'private'` → 404
     - Meta function sets robots tag based on `meta.visibility`.

3. **Add a site layout (separate from Studio)**
   - Restructure route config in `app/routes.ts` to have a site layout parent:
     - Layout loader fetches:
       - `SITE_SETTINGS_QUERY`
       - `HEADER_QUERY`
       - `FOOTER_QUERY`
       - `THEME_SETTINGS_QUERY`
       - `ANALYTICS_QUERY` (optional: keep in root loader if preferred)
     - Layout renders header/footer minimally and injects theme tokens as CSS variables.
   - Keep `/studio/*` route outside the site layout so analytics and site chrome don’t apply.

4. **Ensure Presentation Mode is fully wired**
   - Confirm `presentationTool` resolve config matches the new routes (`/` and `/:slug`).
   - Confirm preview cookie/token env names match `.env.example`.

5. **SEO**
   - Ensure `/sitemap.xml` and `/robots.txt` are registered and correct.
   - Confirm sitemap excludes hidden/private.

6. **Analytics + consent**
   - Replace any env-driven plausible config (`app/config.ts`, etc.) with Sanity-driven config.
   - Ensure no analytics executes on `/studio/*`.
   - Confirm proxy routes are enabled and registered.

7. **Docs + scripts polish**
   - Ensure `package.json` scripts are accurate and match README.
   - Ensure `.env.example` is complete.

8. **Golden-path smoke test**
   - Fresh install run-through:
     - Studio loads with correct desk structure.
     - Create homepage/page content.
     - Preview from studio works.
     - Sitemap/robots work.
     - Rich text, links, images render.

### Test plan
- **Local**:
  - `pnpm dev` and navigate to `/` and `/:slug`.
  - `pnpm sanity:dev` and confirm:
    - structure builder groups singletons
    - homepage and legal pages are accessible as singletons
  - Preview:
    - enable preview from studio and confirm drafts visible.
- **SEO**:
  - `/robots.txt` and `/sitemap.xml` are correct.
- **Analytics**:
  - Consent banner shows; scripts load only after consent; no tracking on `/studio`.

### Definition of done
- [ ] Demo “house” schema and routes removed
- [ ] Starter supports `homepage` + `page` content model end-to-end
- [ ] Queries live under `app/sanity/queries` and are used by loaders
- [ ] TypeGen works via scripts and produces types for queries
- [ ] Presentation mode works end-to-end
- [ ] SEO routes + visibility semantics work
- [ ] Analytics + consent work and are Sanity-driven
- [ ] README + `.env.example` reflect the real setup and scripts
