## ART-364: Environment & Documentation

- **Linear**: `https://linear.app/arthouse/issue/ART-364/environment-and-documentation`
- **Goal**: Make the starter “golden path” reproducible via a well-commented `.env.example` and an accurate README.

### Objective
- Provide a complete `.env.example` with:
  - all required vars
  - short inline explanations and links
  - sane defaults for local dev
- Update `README.md` so it matches actual scripts, architecture, and extension patterns.

### Can run in parallel with
- ART-357 (as the ticket notes), but final variable names should match decisions from ART-359/361/365.

### Repo reality (important)
- `README.md` currently references scripts that **don’t exist** in `package.json` (e.g. `sanity:dev`, `sanity:deploy`).
- This workspace contains a `.env.example` file, but it is currently **filtered by ignore rules** in this environment (so edits may require adjusting ignore config or rewriting the file via allowed paths).

### Key decisions to lock
- **Token env name**:
  - Prefer `SANITY_API_READ_TOKEN` (ticket standard)
  - Keep compatibility for existing `SANITY_READ_TOKEN` during migration
- **Preview origin env name**:
  - Ensure whichever name is used is read consistently by `sanity.config.ts`.

### Code touch points
- `.env.example`
- `README.md`

### Implementation plan (step-by-step)
1. **Update `.env.example`**
   - Include sections and inline comments (per ticket):
     - SANITY public vars:
       - `VITE_SANITY_PROJECT_ID`
       - `VITE_SANITY_DATASET`
       - `VITE_SANITY_API_VERSION`
       - `VITE_SANITY_STUDIO_URL`
     - SANITY private vars:
       - `SANITY_API_READ_TOKEN` (preview/tokenized reads)
       - `SANITY_SESSION_SECRET` (cookie session secret)
     - Preview origin:
       - `SANITY_STUDIO_PREVIEW_ORIGIN` (or the chosen equivalent)
     - SITE:
       - `SITE_URL` (used by sitemap/robots)
     - ANALYTICS:
       - comment that analytics config is managed in Sanity `siteSettings.analytics`

2. **Update README: Quick start**
   - Clone, install, copy `.env.example` → `.env`.
   - Start app + studio.

3. **Update README: Sanity project setup**
   - Steps:
     - create project/dataset
     - set CORS origins
     - create viewer token for preview

4. **Update README: Scripts reference**
   - Must match `package.json` after ART-359:
     - `sanity:extract`, `sanity:typegen`, `sanity:types`, `sanity:dev`, `sanity:build`, `sanity:deploy`

5. **Update README: Extending the starter**
   - Where to add:
     - new schemas: `app/sanity/schema/documents` and `app/sanity/schema/objects`
     - new queries: `app/sanity/queries` with stubs
     - new UI components: `app/ui/components`
     - new routes: `app/routes.ts` (explicit route config)

### Test plan
- **Manual**:
  - New developer can follow README from scratch.
  - `.env.example` covers all variables needed to run:
    - `pnpm dev`
    - `pnpm sanity:dev`
    - `pnpm sanity:types`

### Definition of done (mirrors ticket)
- [ ] `.env.example` with all vars and inline comments
- [ ] `README.md` setup guide
- [ ] `README.md` scripts reference
- [ ] `README.md` extension guide
