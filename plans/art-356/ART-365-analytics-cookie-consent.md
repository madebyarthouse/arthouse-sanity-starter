## ART-365: Analytics & Cookie Consent

- **Linear**: `https://linear.app/arthouse/issue/ART-365/analytics-and-cookie-consent`
- **Goal**: Sanity-driven analytics configuration + consent-gated loading, with reverse proxy routes for Plausible + PostHog.

### Objective
- Add an `analyticsSettings` object to schema and wire it into `siteSettings`.
- Add `ANALYTICS_QUERY` to query layer.
- Implement reverse proxy routes:
  - `/js/script` → Plausible script
  - `/api/event` → Plausible event endpoint
  - `/ingest/*` → PostHog ingest proxy
- Implement consent UI and script gating using `@c15t/react` and Sanity-driven copy/categories.

### Independent / parallel
Ticket notes this can be worked in parallel, but practical integration is easiest after:
- ART-357 (schema exists)
- ART-358 (query layer exists)

### Non-goals
- Fancy analytics dashboards
- Tracking strategy decisions beyond “only after consent”

### Key decisions carried in
- Analytics config lives in **Sanity** (editors can update banner copy + categories).
- Reverse proxy routes are used to bypass ad blockers.
- Consent-gated: only load analytics when user opts into the relevant category.

### Code touch points
Schema:
- `app/sanity/schema/objects/analytics-settings.ts`
- `app/sanity/schema/documents/site-settings.ts` (add `analytics` field)

Queries:
- `app/sanity/queries/analytics.ts` (export `ANALYTICS_QUERY`)

Routes (proxy):
- Existing:
  - `app/routes/js.script.ts`
  - `app/routes/api.event.ts`
- New:
  - `app/routes/ingest.$.ts`

Route registration:
- `app/routes.ts` (register `/js/script`, `/api/event`, `/ingest/*`)

UI:
- `app/ui/components/analytics/AnalyticsProvider.tsx`
- `app/ui/components/analytics/PlausibleGate.tsx`
- `app/ui/components/analytics/PostHogGate.tsx`
- `app/ui/components/analytics/CookieConsentBanner.tsx`

Root integration:
- `app/root.tsx` loader + layout wrapper

### Implementation plan (step-by-step)
1. **Schema: analytics settings**
   - Implement `analyticsSettings` per ticket fields:
     - `consentBanner` (headline/description/labels)
     - `plausible` (enabled/domain/proxyEnabled/selfHostedUrl)
     - `posthog` (enabled/projectKey/proxyEnabled/host)
     - `consentCategories[]` (key/label/description/required)
   - Add `siteSettings.analytics` field of type `analyticsSettings`.

2. **Query: ANALYTICS_QUERY**
   - Add `app/sanity/queries/analytics.ts`:
     - `export const ANALYTICS_QUERY = defineQuery(`*[_type=="siteSettings"][0].analytics{...}`)`

3. **Proxy routes (enable real forwarding)**
   - Update existing Plausible proxy routes to remove the “disabled for testing” behavior.
   - Ensure:
     - `/js/script` fetches and returns the Plausible script (respecting self-hosted URL if configured).
     - `/api/event` forwards POST payloads and preserves attribution headers (`X-Forwarded-For`, `User-Agent`) where available.
   - Add PostHog ingest proxy:
     - `/ingest/*` forwards to the configured PostHog host (default `https://eu.posthog.com`) while preserving the remainder of the path.

4. **Register routes in `app/routes.ts`**
   - Add:
     - `route('js/script', 'routes/js.script.ts')`
     - `route('api/event', 'routes/api.event.ts')`
     - `route('ingest/*', 'routes/ingest.$.ts')`

5. **Consent + gating UI**
   - Add `@c15t/react`.
   - Implement:
     - `CookieConsentBanner`: renders from Sanity config + sets consent categories.
     - `AnalyticsProvider`: provides consent state and renders gates.
     - `PlausibleGate`: injects script tag when measurement consent granted and plausible enabled.
       - Use proxied script `src="/js/script"` and `data-api="/api/event"`.
     - `PostHogGate`: initializes PostHog only when consent granted.
       - Prefer `posthog-js` OR a minimal snippet, configured to send via `/ingest` proxy.

6. **Root integration**
   - Update `app/root.tsx` loader to fetch analytics config via `loadQuery(ANALYTICS_QUERY)`.
   - Wrap the layout output with `<AnalyticsProvider config={analytics}>...</AnalyticsProvider>`.
   - Ensure analytics scripts do **not** run on `/studio/*` routes (avoid tracking studio page views):
     - gate by pathname, or by route id.

### Test plan
- **Manual**:
  - With consent unset: no Plausible/PostHog scripts loaded.
  - Accept measurement consent: scripts load, requests go through proxied routes.
  - Reject: scripts never load.
  - Verify `/studio` does not trigger analytics.
- **Network inspection**:
  - Check requests hit `/js/script`, `/api/event`, `/ingest/...` and forward correctly.

### Risks / notes
- Because this repo uses explicit `app/routes.ts`, existing proxy modules won’t be active until registered.
- Keep analytics config in Sanity; avoid leaking keys into client bundles unnecessarily.

### Definition of done (mirrors ticket)
- [ ] `analyticsSettings` object schema
- [ ] `siteSettings.analytics` field
- [ ] `ANALYTICS_QUERY`
- [ ] Proxy routes for Plausible + PostHog
- [ ] Consent banner UI driven by Sanity config
- [ ] Root layout integration
