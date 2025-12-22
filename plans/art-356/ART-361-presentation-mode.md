## ART-361: Presentation Mode

- **Linear**: `https://linear.app/arthouse/issue/ART-361/presentation-mode`
- **Goal**: Complete Sanity Presentation Tool + React Router Visual Editing integration (live preview, click-to-edit, preview cookie).

### Objective
- Ensure the repo fully supports:
  - Preview mode enable/disable endpoints
  - Cookie-based preview session
  - Draft/published perspective switching via `loadQuery`
  - Studio Presentation tool “locations” + “mainDocuments” resolution
  - Client-side `VisualEditing` overlay in preview

### Depends on
- ART-357 Schema Foundation (expects `homepage` + `page` types)
- ART-358 Query Layer (routes will use stable queries)

### Repo reality (what already exists)
- Preview session + perspective switching: `app/sanity/preview.ts` (`previewContext`)
- Server query loader: `app/sanity/loader.server.ts`
- Preview enable/disable routes:
  - `app/routes/api/preview-mode/enable.ts`
  - `app/routes/api/preview-mode/disable.ts`
- Visual Editing component: `app/components/sanity-visual-editing.tsx`
- Root already conditionally renders visual editing when `preview` is true: `app/root.tsx`
- Studio config already includes `presentationTool(...)` but is missing `resolve` config: `sanity.config.ts`

### Non-goals
- Building site page routes/content rendering (ART-356 / ART-362)

### Key decisions carried in
- Preview is gated by a server-side token and cookie session.
- `homepage` and `page` documents are the primary presentation entry points.

### Code touch points
Create:
- `app/sanity/presentation/resolve.ts`

Modify (as needed):
- `sanity.config.ts` (add `resolve: { locations, mainDocuments }`)
- `app/sanity/loader.server.ts` (align token env naming)
- `app/routes/api/preview-mode/enable.ts` (align token env naming)
- `app/sanity/preview.ts` (ensure session secret + options shape is correct)

### Implementation plan (step-by-step)
1. **Add resolve config for presentation tool**
   - Create `app/sanity/presentation/resolve.ts` exporting:
     - `locations` (homepage + page location resolvers)
     - `mainDocuments` (route-to-document mapping)

2. **Wire resolve into `sanity.config.ts`**
   - Update `presentationTool({ previewUrl, resolve: { locations, mainDocuments } })`.

3. **Align environment variables (preview origin + read token)**
   - Standardize naming (finalized in ART-364):
     - Prefer `SANITY_API_READ_TOKEN` as the server token (ticket standard)
     - Keep backward-compatible fallback to existing `SANITY_READ_TOKEN` during migration
   - Ensure `SANITY_SESSION_SECRET` remains required (already enforced in `app/sanity/preview.ts`).

4. **End-to-end preview flow validation**
   - From Studio → Presentation:
     - “Open preview” hits `/api/preview-mode/enable?...secret=...`
     - cookie is set
     - app switches to `previewDrafts` + `stega: true`
     - VisualEditing overlay appears

### Test plan
- **Manual**:
  - Run app (`pnpm dev`) and studio (`pnpm sanity:dev` once scripts exist).
  - In studio, open Presentation tool and verify:
    - homepage resolves to `/`
    - page resolves to `/:slug`
    - enabling preview sets cookie and redirects correctly
  - Confirm in preview:
    - draft content is visible
    - click-to-edit works (stega attributes present)
    - “Disable preview mode” clears cookie.

### Risks / notes
- `sanity.config.ts` currently uses `import.meta.env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN`; ART-364’s env plan may switch to a non-`VITE_` name. Keep a fallback to avoid breaking local setups.

### Definition of done (mirrors ticket)
- [ ] `resolve.ts` with location definitions
- [ ] `sanity.config.ts` presentationTool config includes `resolve`
- [ ] Root integration correctly toggles visual editing (already present; verify)
- [ ] Preview enable/disable endpoints work end-to-end
