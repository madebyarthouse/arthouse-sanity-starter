## ART-366: Branch issues tracker

This document tracks follow-up issues found after completing ART-360–365 work.

### Open items

#### 1) Presentation mode singleton references

- **Problem**: Singleton docs (header/footer/siteSettings/themeSettings) may not be detected as referenced if their fields aren’t represented in the DOM.
- **Where**: `app/routes/layout.tsx`
- **Fix**: Attach `data-sanity` markers to the real semantic elements:
  - `Header` → `<header data-sanity=...>`
  - `Footer` → `<footer data-sanity=...>`
  - `siteSettings` marker on `<main>`
  - `themeSettings` marker via a hidden element
- **Status**: done

#### 2) Plausible proxy + localhost behavior

- **Problem**: Plausible should not run on localhost, and should use proxy routes when enabled.
- **Where**: `app/routes/js.script.ts`, `app/routes/api.event.ts`, `app/routes/layout.tsx` (gate injection)
- **Fix**:
  - Gate script injection behind consent + production-only + non-localhost.
  - Respect `plausible.proxyEnabled`:
    - when enabled: serve script + forward events through `/js/script` + `/api/event`
    - when disabled: load Plausible directly from `selfHostedUrl` (or `plausible.io`)
- **Status**: done

#### 3) Studio preview origin runtime error

- **Problem**: Embedded Studio ran in the browser where `process` is undefined.
- **Where**: `sanity.config.ts`
- **Fix**: Make preview-origin resolution safe in both contexts:
  - prefer `process.env` for CLI
  - fall back to `import.meta.env` for embedded studio
- **Status**: done

#### 4) RichText type slop / escaping types

- **Problem**: RichText renderer relied on `as any` and unsafe casts.
- **Where**: `app/components/features/sanity/rich-text/index.tsx`
- **Fix**:
  - Align PortableText `value` type to query shapes.
  - Remove `as any` and value casts.
- **Status**: done

#### 5) c15t consent category typing

- **Problem**: `@c15t/react` has a fixed `AllConsentNames` union; custom keys caused TS errors.
- **Where**: `app/components/features/analytics/*`, `app/sanity/schema/objects/analytics-settings.ts`
- **Fix**:
  - Use supported consent key(s) (currently `functionality` + `necessary`).
- **Status**: done

### Notes / follow-ups

- Consider switching consent category from `functionality` to the “proper” analytics/statistics category if/when c15t supports it in the local/offline mode typing.
- Consider tightening the upstream proxy responses (headers/caching) once production hosting is decided.
