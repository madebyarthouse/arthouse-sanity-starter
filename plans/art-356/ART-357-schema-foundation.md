## ART-357: Schema Foundation

- **Linear**: `https://linear.app/arthouse/issue/ART-357/schema-foundation`
- **Goal**: Replace the demo `house` schema with the starter’s core content model (singletons + page building) and prepare a stable foundation for queries/typegen/preview.

### Objective
- Implement the **document schemas** and **object schemas** described in ART-357 under a maintainable structure.
- Ensure schema organization supports the later tickets:
  - ART-358 Query Layer (needs stable field names)
  - ART-360 Structure Builder (needs singleton IDs/types)
  - ART-361 Presentation Mode (expects `homepage` + `page` documents)
  - ART-363 SEO Routes (expects `meta.visibility` semantics)

### Non-goals (explicitly not in ART-357)
- GROQ queries (ART-358)
- TypeGen config/scripts (ART-359)
- UI rendering components (ART-362)
- SEO routes (ART-363)
- Consent + analytics UI/proxies (ART-365)

### Key decisions carried in
- **Sanity vs UI separation**: all schema + queries live under `app/sanity/**`, React-only components under `app/ui/**`.
- **No Zod**: type-safety comes from Sanity TypeGen query result types.
- **Visibility semantics**: `meta.visibility` ∈ `public | hidden | private`.
- **Homepage modeling**: implement a **dedicated `homepage` document type** (because later tickets reference `_type == "homepage"` in queries and presentation filters).

### Code touch points
Create/modify:
- `app/sanity/schema/index.ts` (export `schemaTypes` array)
- `app/sanity/schema/documents/*`
- `app/sanity/schema/objects/*`

Remove:
- `app/sanity/schema/house.ts`

Note: demo routes that query `house` can remain temporarily but will be removed/rewired in ART-356.

### Implementation plan (step-by-step)
1. **Restructure schema folder**
   - Create:
     - `app/sanity/schema/documents/`
     - `app/sanity/schema/objects/`
   - Update `app/sanity/schema/index.ts` to export all new types.

2. **Implement object schemas (`app/sanity/schema/objects/`)**
   - `meta.ts`
     - fields: `title`, `description`, `keywords`, `ogImage`, `visibility`
     - `visibility` options:
       - `public` (default)
       - `hidden` (public but `noindex` and excluded from sitemap)
       - `private` (not reachable; page loader returns 404)
   - `complex-image.ts`
     - fields: `asset`, `alt`, `caption`, optional `width`
   - `mark-external-link.ts`
     - fields: `type (url|email|phone|file)`, plus the relevant target field
   - `mark-internal-link.ts`
     - field: `link` (reference; for starter: reference to `page` and optionally `homepage`)
   - `rich-text.ts`
     - portable text definition with:
       - blocks (h1–h3, normal paragraph)
       - lists
       - marks including `markExternalLink`, `markInternalLink`
       - object types including `complexImage` and `separator`
   - `nav-link.ts`
     - fields: `type (internal|external)`, `title`, `reference`, `externalLink`
   - `cta-link.ts`
     - fields: `type`, `label`, `internalLink`, `externalLink`
   - `social-link.ts`
     - fields: `platform`, `url`
   - `analytics-settings.ts`
     - create a **minimal placeholder shape** now (the full fields are defined/expanded in ART-365)
   - `meta-settings.ts`
     - site-wide meta config (title template, defaults) used by `siteSettings`

3. **Implement document schemas (`app/sanity/schema/documents/`)**
   - **Singletons** (disable create/delete; enforce fixed documentIds via structure later):
     - `site-settings.ts`
       - fields: `metaSettings`, `favicon`, `ogVisual`, `socials[]`, `privacyPolicy→`, `imprint→`, `analytics`
     - `theme-settings.ts`
       - fields: `brandColor`, `textColor`, `backgroundColor`
     - `header.ts`
       - fields: `logo`, `nav[]`, `cta`
     - `footer.ts`
       - fields: `logo`, `mainNav[]`, `secondaryNav[]`, `socials[]`
   - **Content docs**:
     - `page.ts`
       - fields: `meta`, `slug`, `title`, `contentMode`, `richText`, `components[]`
       - `contentMode` options: `richText | pageBuilder`
       - conditional field visibility: hide `richText` when `pageBuilder`, hide `components` when `richText`
     - `homepage.ts`
       - same content fields as `page` **but no slug** and treated as singleton

4. **Update schema exports**
   - `app/sanity/schema/index.ts` exports `schemaTypes` containing all document/object types.
   - Remove `house` import and delete `app/sanity/schema/house.ts`.

5. **Sanity Studio boot check**
   - Ensure `sanity dev` loads without schema errors.
   - Validate:
     - document types appear
     - portable text editor supports required marks/objects
     - required fields enforce correctly

### Test plan
- **Manual**:
  - Start studio (`pnpm sanity dev` or equivalent script once added in ART-359).
  - Create a `page`, verify `slug`, `contentMode`, `meta.visibility`.
  - Create `homepage` and verify it has no slug.
  - In rich text, insert:
    - external link mark
    - internal link mark
    - complex image
- **Regression**:
  - Ensure `sanity.config.ts` still loads `schemaTypes` from `app/sanity/schema`.

### Risks / notes
- Later tickets assume `_type == "homepage"` exists; implementing `homepage` as a separate document type here avoids mismatches.
- Analytics schema is created as a placeholder here and **expanded in ART-365**.

### Definition of done (mirrors ticket)
- [ ] All document schemas implemented
- [ ] All object schemas implemented
- [ ] `app/sanity/schema/index.ts` exports `schemaTypes`
- [ ] Demo `house.ts` removed
