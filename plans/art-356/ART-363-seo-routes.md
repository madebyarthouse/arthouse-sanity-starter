## ART-363: SEO Routes

- **Linear**: `https://linear.app/arthouse/issue/ART-363/seo-routes`
- **Goal**: Add dynamic `sitemap.xml` + `robots.txt` and enforce `meta.visibility` semantics across page routes.

### Objective
- Implement:
  - `GET /sitemap.xml` (XML)
  - `GET /robots.txt` (plain text)
- Ensure visibility handling:
  - `public` (or undefined) → indexable + included in sitemap
  - `hidden` → reachable but `noindex,follow` + excluded from sitemap
  - `private` → 404 (not reachable)

### Depends on
- ART-358 Query Layer (needs `SITEMAP_QUERY`)
- ART-359 TypeGen Setup (optional but recommended for typed sitemap results)

### Code touch points
Create:
- `app/routes/sitemap.xml.ts`
- `app/routes/robots.txt.ts`

Modify:
- `app/sanity/queries/sitemap.ts` (or ensure it exists from ART-358)
- `app/routes.ts` (register the routes in the route config)
- Page route module(s) to enforce visibility:
  - likely `app/routes/$slug.tsx` (for `/:slug` pages)
  - homepage route module (index) for `/` if it uses `meta.visibility`

### Implementation plan (step-by-step)
1. **SITEMAP_QUERY**
   - Add/confirm `SITEMAP_QUERY` in `app/sanity/queries/sitemap.ts`:
     - include `_type in ["page", "homepage"]`
     - include only `meta.visibility == "public" || !defined(meta.visibility)`
     - return `{ url, _updatedAt }` where `url` resolves to `/` for homepage and `/${slug}` for pages.

2. **Route: `sitemap.xml`**
   - Create `app/routes/sitemap.xml.ts` loader that:
     - calls `loadQuery(SITEMAP_QUERY)`
     - builds XML
     - sets header `Content-Type: application/xml`
   - Use `SITE_URL` env var as base URL (fallback to placeholder in dev).

3. **Route: `robots.txt`**
   - Create `app/routes/robots.txt.ts` loader that:
     - returns disallow rules for `/studio` and `/api/`
     - includes `Sitemap: ${SITE_URL}/sitemap.xml`
     - sets `Content-Type: text/plain`

4. **Register routes in `app/routes.ts`**
   - Add route entries:
     - `route('sitemap.xml', 'routes/sitemap.xml.ts')`
     - `route('robots.txt', 'routes/robots.txt.ts')`

5. **Enforce visibility in page loaders/meta**
   - In the `/:slug` page route loader:
     - if `meta.visibility === 'private'` → throw 404
   - In the same route’s `meta` function:
     - if `meta.visibility === 'hidden'` → `{ name: 'robots', content: 'noindex,follow' }`
     - else → `{ name: 'robots', content: 'index,follow' }`

### Test plan
- **Manual**:
  - Visit `/robots.txt` and verify output + headers.
  - Visit `/sitemap.xml` and validate XML is well-formed.
  - Create pages in Sanity with:
    - visibility `public` → appears in sitemap
    - visibility `hidden` → excluded from sitemap, page has `noindex`
    - visibility `private` → page route returns 404

### Risks / notes
- This repo uses explicit route config (`app/routes.ts`); adding route files alone is not sufficient—routes must be registered.
- Ensure sitemap generation does not include drafts (use published perspective unless preview is explicitly required).

### Definition of done (mirrors ticket)
- [ ] `sitemap.xml.ts` route
- [ ] `robots.txt.ts` route
- [ ] `SITEMAP_QUERY` in queries
- [ ] Meta robots handling for `hidden`
- [ ] 404 handling for `private` visibility
