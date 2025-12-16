## ART-358: Query Layer

- **Linear**: `https://linear.app/arthouse/issue/ART-358/query-layer`
- **Goal**: Establish a maintainable GROQ query layer using `defineQuery` + reusable projection fragments (stubs) **in a way that still works with Sanity TypeGen**.

### Objective

- Create `app/sanity/queries/**` with:
  - **Stubs** (`app/sanity/queries/stubs/*`) for reusable GROQ fragments
  - **Query modules** for key content types
  - A **barrel export** (`app/sanity/queries/index.ts`)
- Align queries to ART-357’s schema names/fields.

### Non-goals

- Rewriting all routes to use the new queries (that integration can happen incrementally and is ultimately verified in ART-356).
- Any validation layer (no Zod).

### Key decisions carried in

- **Stubs pattern**: define reusable **string** fragments and compose them into `defineQuery(...)` templates via template-literal interpolation.
  - Sanity TypeGen supports `defineQuery` and supports string interpolation in queries (see [Sanity TypeGen docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen#k47494ab9257c)).
  - Avoid custom GROQ functions inside queries, because TypeGen does not support them and they can error generation (see the “Unsupported expressions” note in [Sanity TypeGen docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen#k47494ab9257c)).
- **TypeGen discoverability**: queries must be assigned to uniquely named variables and use `defineQuery`/`groq` template literals (avoid inline queries) so TypeGen can generate `*_QUERYResult` types (see [Sanity TypeGen docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen#k47494ab9257c)).
- **Separation**: query modules live in `app/sanity/queries/`, UI components do not contain GROQ.

### Code touch points

Create:

- `app/sanity/queries/index.ts`
- `app/sanity/queries/stubs/`
  - `meta.ts`
  - `complex-image.ts`
  - `rich-text.ts`
  - `nav-link.ts`
- `app/sanity/queries/`
  - `site-settings.ts`
  - `theme-settings.ts`
  - `header.ts`
  - `footer.ts`
  - `page.ts`
  - `homepage.ts`
  - `sitemap.ts`
  - `analytics.ts`

### Implementation plan (step-by-step)

1. **Create folder structure**
   - Add `app/sanity/queries/` and `app/sanity/queries/stubs/`.

2. **Define stub fragments**
   - Use plain **string** fragments for projections, e.g.
     - `export const metaStub = groq`title, description, ...``
   - Compose stubs by interpolation inside the exported query constant:
     - `export const PAGE_QUERY = defineQuery(`... { meta { ${metaStub} }, ... }`)`
   - Keep stubs **static** (string constants) so TypeGen can reason about them. Avoid functions like `const meta = () => '...'`.
   - Stubs expected by ticket:
     - `metaStub`
     - `complexImageStub`
     - `baseRichTextStub` and `richTextStub`
     - `navLinkStub`

3. **Write query modules using `defineQuery` from `groq`**
   - For each query, export a named constant, e.g. `export const SITE_SETTINGS_QUERY = defineQuery(`...`)`.
   - Ensure query results match ART-357 fields and later tickets:
     - Pages include `meta.visibility`.
     - `homepage` is `_type == "homepage"`.
     - `SITEMAP_QUERY` includes only public pages/homepage and returns `{ url, _updatedAt }`.

4. **Barrel exports**
   - Export all query constants from `app/sanity/queries/index.ts`.

5. **Add at least one consumer (optional but recommended)**
   - To ensure the query layer is “real” and TypeGen can find queries later, update one route loader (e.g. homepage) to import a query constant and call `loadQuery(query)`.
   - If you prefer to avoid route edits in this ticket, do the first consumer in ART-359 or ART-356 instead.

6. **Fallback plan if TypeGen doesn’t like a stub**
   - If you hit a case where TypeGen can’t fully type the result due to interpolation complexity, keep it simple:
     - inline the projection in that query (duplicate code is OK)
     - still keep logical grouping by file (`page.ts`, `homepage.ts`, `site-settings.ts`, etc.)
     - reserve stubs for the “easy wins” (e.g. `meta`, `navLink`) and inline the most complex bit (portable text / rich text).

### Test plan

- **Manual**:
  - Run the app and verify one loader can execute a query imported from `app/sanity/queries/*`.
  - Validate query strings compile (no runtime GROQ parse errors).
- **TypeGen readiness**:
  - Confirm queries are discoverable under `./app/**/*.{ts,tsx}` for TypeGen (ART-359 will formalize).

### Risks / notes

- Ticket examples reference `groq` from `next-sanity` for stubs; this repo already has `groq` (and not `next-sanity`). Prefer fragment strings + `defineQuery` for compatibility.
- Keep stub names and field selections stable; they become the backbone for UI component props + meta/SEO.

### Definition of done (mirrors ticket)

- [ ] All stub files in `app/sanity/queries/stubs/`
- [ ] All query files with `defineQuery`
- [ ] `index.ts` barrel export
