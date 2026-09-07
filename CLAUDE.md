# CLAUDE.md

Follow **[AGENTS.md](./AGENTS.md)** for stack, aliases, Biome, `process.env`, Workers Cache, and Sanity typegen.

Claude-only notes:

- After schema or GROQ edits, run `pnpm typecheck` so `sanity.types.ts` and route types stay in sync.
- Do not revert the Cloudflare Workers migration.
- Prefer Tailwind utilities; keep global CSS in `app/app.css` (theme tokens + ABC Whyte + shadcn variables).
