## Agent notes (project conventions)

### Import aliases

- **App-root alias**: use `@/…` for anything under `app/`.
  - Example: `import { Container } from '@/components/ui'`
- **Generated Sanity types**: use `@gen/sanity` (type-only) instead of importing `../../sanity.types`.
  - Example: `import type { PAGE_QUERYResult } from '@gen/sanity'`
- **Repo-root alias**: use `@root/…` for repo-root runtime imports when needed.
  - Example: `import config from '@root/sanity.config'`
- **React Router route types exception**: keep `./+types/*` imports relative.
  - Example: `import type { Route } from './+types/index'`

### Styling

- Tailwind CSS only.
- Global CSS is limited to **Tailwind v4 `@theme` tokens + minimal base** in `app/app.css`.

### Component structure

- `app/components/ui/`: generic UI primitives.
- `app/components/features/layout/`: header/footer/site chrome.
- `app/components/features/sanity/`: components tied directly to Sanity schema/rendering.
- `app/components/features/analytics/`: analytics + consent feature (ART-365).

### Common scripts

- `pnpm dev`: app + embedded studio.
- `pnpm sanity:dev`: standalone studio.
- `pnpm sanity:types`: regenerate `sanity.types.ts`.
- `pnpm typecheck`: runs typegen + `tsc --noEmit`.
- `pnpm format`: prettier.
