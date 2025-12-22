## ART-362: UI Components

- **Linear**: `https://linear.app/arthouse/issue/ART-362/ui-components`
- **Goal**: Build a small UI component library that renders the starter’s Sanity content types, consuming **TypeGen-generated types**.

### Objective
- Create `app/ui/components/**` and `app/ui/helpers/**` with:
  - `RichText` (PortableText)
  - `ComplexImage` (Sanity image URL builder)
  - `NavLink` (internal/external link resolution)
  - `ExternalLink` + `InternalLink` (PortableText marks)
  - Helpers: `resolve-href.ts`, `url-for.ts`

### Depends on
- ART-358 Query Layer (queries define what UI receives)
- ART-359 TypeGen Setup (generated types are the source of truth)

### Non-goals
- Full site layout/branding polish (starter-level only)
- Schema work (ART-357)

### Key decisions carried in
- UI folder contains **React only** (no GROQ, no schema, no validators).
- Data contracts are **TypeGen types** (`app/sanity/types.ts`).
- Components should be **composable** (override points) and keep a small surface area.
- Image rendering should be **responsive** (srcset + sizes) to avoid over-downloading on mobile.

### Code touch points
Create:
- `app/ui/components/rich-text/index.tsx`
- `app/ui/components/complex-image/index.tsx`
- `app/ui/components/nav-link/index.tsx`
- `app/ui/components/links/external-link.tsx`
- `app/ui/components/links/internal-link.tsx`
- `app/ui/helpers/resolve-href.ts`
- `app/ui/helpers/url-for.ts`
- `app/ui/components/index.ts` (barrel)

### Dependencies to add (expected)
- `@portabletext/react`
- `@portabletext/types` (optional but helpful)
- `@sanity/image-url`

### Implementation plan (step-by-step)
1. **Create `app/ui/helpers/url-for.ts`**
   - Build a `urlFor` helper using `@sanity/image-url` + the existing Sanity client config (`app/lib/sanity.ts`).
   - Ensure the builder defaults are optimized:
     - `auto('format')`
     - reasonable default `quality` (e.g. 70–80)
     - `fit('max')` (or `crop` when hotspots are desired later)

2. **Create `ComplexImage`**
   - Accept the TypeGen object type for `complexImage` from `app/sanity/types.ts`.
   - Render a responsive `<img>` (or `<picture>`) that adapts to viewport size:
     - build `srcSet` from a fixed width ladder (e.g. `[320, 480, 640, 768, 1024, 1280, 1600, 1920]`)
     - accept a `sizes` prop with a sane default (e.g. `100vw`)
     - choose `src` as a mid-sized fallback (e.g. 1024)
     - set `loading="lazy"` and `decoding="async"`
     - include `width/height` when available to reduce CLS (use the asset metadata if exposed in queries)
     - keep caption rendering optional
   - Keep the component composable:
     - allow passing `className`, `imgClassName`, `figureClassName`
     - allow overriding width ladder if needed

3. **Create `resolve-href.ts`**
   - Map Sanity references to URLs:
     - `homepage` → `/`
     - `page` → `/${slug}`
   - Keep logic centralized so marks + nav share it.

4. **Create link components**
   - `InternalLink`: uses `resolveHref` + `react-router` `Link`.
   - `ExternalLink`: supports `url | email | phone | file` and renders appropriate `href`.

5. **Create `RichText`**
   - Implement carefully to stay ergonomic and type-safe:
     - Prefer typing `RichText` from **query result types** (what the UI actually receives) rather than raw schema types.
       - Example strategy: `type RichTextValue = NonNullable<PAGE_QUERYResult>['richText']` (and similarly for homepage) after TypeGen.
     - Keep `RichText` composable by allowing `components` overrides (merge user overrides into defaults).
     - Keep the PortableText mapping stable and minimal.

   - Use `PortableText` with a default `components` mapping:
     - `marks.markExternalLink` → `ExternalLink`
     - `marks.markInternalLink` → `InternalLink`
     - `types.complexImage` → `ComplexImage`
     - block styles for h1–h3, normal, lists
   - Ensure the mark/type keys match schema names from ART-357.
   - If TypeGen makes the PortableText value type too complex for `@portabletext/react` generics, contain the complexity inside `RichText`:
     - keep `RichText`’s public prop typed
     - cast only at the `PortableText` call site (single, isolated cast), so the rest of the app stays strongly typed.

6. **Create `NavLink`**
   - Render internal links with `Link`, external with `<a>`.
   - Use shared `resolveHref`.

7. **Barrel exports**
   - Export components from `app/ui/components/index.ts` for clean imports.

### Test plan
- **Type checks**:
  - Confirm components compile against TypeGen types after running `pnpm sanity:types`.
- **Manual**:
  - Render a page route with mocked data (or real query data) containing:
    - rich text with internal/external links
    - complex image
    - navigation links

### Risks / notes
- If schema mark names change (e.g. `markExternalLink` renamed), the PortableText `components.marks` mapping must be updated.
- PortableText typing is the most common “paper cut”; isolating any necessary cast inside `RichText` keeps the rest of the codebase clean.

### Definition of done (mirrors ticket)
- [ ] `RichText` with all block/mark types
- [ ] `ComplexImage` with url builder
- [ ] `NavLink` component
- [ ] `ExternalLink` component
- [ ] `InternalLink` component
- [ ] `resolve-href.ts` helper
- [ ] `url-for.ts` helper
- [ ] Export barrel
