## ART-360: Structure Builder

- **Linear**: `https://linear.app/arthouse/issue/ART-360/structure-builder`
- **Goal**: Provide a fixed, extendable desk structure with singleton grouping and sane defaults.

### Objective
- Implement `app/sanity/structure.ts` matching the desired navigation structure:
  - Settings folder (General/Theme/Header/Footer)
  - Homepage singleton
  - Pages section with legal singletons and a filtered “All Pages” list
  - Auto-add other document types
- Wire it into `sanity.config.ts` via `structureTool({ structure })`.
- Add a **small, starter-friendly Studio branding hook** for embedded Studio (logo/title/basic theme), so projects can customize the Studio identity with minimal code changes.

### Non-goals
- Schema creation (ART-357)
- Presentation/preview setup (ART-361)

### Depends on
- ART-357 (Schema Foundation): must provide document types and singleton IDs.

### Code touch points
Create:
- `app/sanity/structure.ts`
- `app/sanity/studio/branding.tsx` (lightweight branding exports)

Modify:
- `sanity.config.ts` (configure `structureTool({ structure })`)

### Implementation plan (step-by-step)
1. **Create `app/sanity/structure.ts`**
   - Export `structure: StructureResolver`.
   - Build a “Content” list with:
     - **Settings** list item → child list items:
       - General → `siteSettings` (documentId: `siteSettings`)
       - Theme → `themeSettings` (documentId: `themeSettings`)
       - Header → `header` (documentId: `header`)
       - Footer → `footer` (documentId: `footer`)
     - **Homepage** singleton → editor using schemaType `homepage` and documentId `homepage`
     - **Pages** list → includes:
       - Impressum singleton → schemaType `page`, documentId `imprint`
       - Datenschutz singleton → schemaType `page`, documentId `privacy`
       - All Pages → filtered list excluding `imprint/privacy` (and drafts)
     - **Other types** → `...S.documentTypeListItems().filter(...)` excluding the handled types.

2. **Wire into studio**
   - Update `sanity.config.ts`:
     - import `{ structure }` from `app/sanity/structure`
     - replace `structureTool()` with `structureTool({ structure })`

3. **Add a simple Studio branding baseline (embedded Studio)**
   - Create `app/sanity/studio/branding.tsx` exporting:
     - `StudioIcon` (React component) used for Studio icon/logo
     - `studioTitle` (string) and optionally `projectName` (string)
     - optionally `studioTheme` (minimal theme override using a single brand color)
   - Update `sanity.config.ts` to:
     - set `title` from `studioTitle` (so the Studio shows the customer/project name)
     - set `icon: StudioIcon` (recommended approach for logo replacement)
     - (optional) set `theme: studioTheme` for very light CI alignment
   - If you want a tiny “brand header”, optionally override `studio.components.navbar` via the Component API (keep it minimal: logo + project name).

   References:
   - Logo/icon customization: https://www.sanity.io/answers/how-to-replace-the-default-sanity-logo-in-the-studio-with-a-custom-logo-
   - Component API (navbar overrides): https://www.sanity.io/docs/component-api
   - Theming: https://www.sanity.io/docs/studio/theming

4. **Manual verification**
   - Confirm no duplicates exist for singletons (enforced by structure + disabled actions from schema where appropriate).
   - Confirm Studio title/icon render correctly in the embedded `/studio/*` route.

### Test plan
- **Manual**:
  - Run `sanity dev`.
  - Verify the desk matches the spec.
  - Confirm:
    - homepage opens the `homepage` document
    - legal pages open `page` documents with fixed IDs
    - “All Pages” excludes those singletons.
  - Verify branding:
    - Studio tab/title shows the configured project name
    - icon/logo is replaced

### Risks / notes
- This structure assumes `homepage` is a real schema type (recommended in ART-357 to match later tickets).

### Definition of done (mirrors ticket)
- [ ] `structure.ts` with grouped singletons
- [ ] `sanity.config.ts` wired via `structureTool({ structure })`
