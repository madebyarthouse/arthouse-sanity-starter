## ART-359: TypeGen Setup

- **Linear**: `https://linear.app/arthouse/issue/ART-359/typegen-setup`
- **Goal**: Make end-to-end type safety reliable by standardizing schema extraction + TypeGen scripts and ensuring queries produce generated `*_QUERYResult` types.

### Objective
- Add a canonical **TypeGen config**:
  - **Note**: `sanity-typegen.json` is now considered deprecated in favor of configuring TypeGen directly in `sanity.cli.ts` (per [Sanity TypeGen docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen#k47494ab9257c)).
  - For this starter, prefer configuring `typegen` in `sanity.cli.ts`.
  - If we still want to match the ticket text exactly, we can additionally include `sanity-typegen.json` as a compatibility layer, but it shouldn’t be the single source of truth.
  - The config should ensure:
    - schema extraction to `app/sanity/schema.json`
    - generated query result types to `app/sanity/types.ts`
    - scanning `./app/**/*.{ts,tsx}` for queries using `defineQuery` or `groq` template literals
- Add consistent **package.json scripts** for schema/typegen + studio tasks.
- Provide an **example loader** showing typed `loadQuery<T>()` usage.

### Repo reality that must be fixed
- `sanity.config.ts` currently points TypeGen at `schema: './app/sanity/schema.ts'`, but **that file doesn’t exist**.
- `app/sanity/types.ts` already exists (generated), but scripts/config are not yet standardized in `package.json`.

### Non-goals
- Designing new queries (ART-358)
- Building UI components (ART-362)

### Key decisions carried in
- **No Zod**: rely on Sanity TypeGen query result types.
- **Starter “golden path”**: one command to refresh schema + types.

### Code touch points
Create/modify:
- `sanity.cli.ts` (add `typegen` config block; preferred)
- `sanity-typegen.json` (optional/legacy; only if you want to follow the older pattern)
- `app/sanity/schema.json` (generated via script)
- `package.json` scripts
- Optional: adjust/remove `typegen` block in `sanity.config.ts` to avoid conflicting configuration.

### Implementation plan (step-by-step)
1. **Add TypeGen config (preferred: `sanity.cli.ts`)**
   - Add a `typegen` block in `sanity.cli.ts`:
     - `path: "./app/**/*.{ts,tsx}"`
     - `schema: "./app/sanity/schema.json"`
     - `generates: "./app/sanity/types.ts"`
   - Keep `overloadClientMethods` enabled (default) so `client.fetch(QUERY)` can infer types after generation.
   - Reference: [Sanity TypeGen docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen#k47494ab9257c).

2. **(Optional) Add `sanity-typegen.json` for legacy compatibility**
   - Only if you want it for discoverability or to match ticket wording.
   - Ensure it matches the same paths as `sanity.cli.ts` so there’s no drift.

3. **Add scripts to `package.json`**
   - Add:
     - `sanity:extract`: `sanity schema extract --path ./app/sanity/schema.json`
     - `sanity:typegen`: `sanity typegen generate`
     - `sanity:types`: run extract then typegen
     - `sanity:dev`, `sanity:build`, `sanity:deploy`

4. **Resolve the current `sanity.config.ts` mismatch**
   - Preferred starter approach: **remove or ignore the `typegen` block** in `sanity.config.ts` so we don’t have conflicting config.
   - Use `sanity.cli.ts` as the single source of truth for TypeGen.

5. **Typed loader example**
   - After ART-358 exists, update one loader to:
     - import a query constant (e.g. `HOMEPAGE_QUERY`)
     - import the generated `HOMEPAGE_QUERYResult` type
     - call `loadQuery<HOMEPAGE_QUERYResult>(HOMEPAGE_QUERY, params, options)`

6. **Verify generated output**
   - Confirm `app/sanity/types.ts` includes query result types for the new query layer.

### Test plan
- **CLI**:
  - Run `pnpm sanity:types` and confirm it:
    - creates/updates `app/sanity/schema.json`
    - updates `app/sanity/types.ts`
- **Type check**:
  - Run `pnpm typecheck` and ensure typed loader compiles.

### Risks / notes
- There is already a root-level `schema.json` in the repo today; decide whether to keep it (legacy) or consolidate to `app/sanity/schema.json` for the starter.
- Environment naming should be aligned later (ART-364) — particularly `SANITY_READ_TOKEN` vs `SANITY_API_READ_TOKEN`. Prefer matching ART-364, with a backward-compatible fallback.

### Definition of done (mirrors ticket)
- [ ] TypeGen configured (preferred via `sanity.cli.ts`; optional `sanity-typegen.json` if desired)
- [ ] `sanity.cli.ts` exists (it does) and works with env vars
- [ ] Package.json scripts added
- [ ] Generated `types.ts` includes query result types
- [ ] Example loader demonstrating type inference
