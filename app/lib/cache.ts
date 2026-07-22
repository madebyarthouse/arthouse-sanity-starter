import { cacheHeader } from 'pretty-cache-header';

/**
 * Standard cache header:
 * - short fresh window
 * - long stale-while-revalidate window
 */
export const DEFAULT_CACHE_CONTROL = cacheHeader({
  public: true,
  maxAge: '1m',
  sMaxage: '1m',
  staleWhileRevalidate: '1w',
});

/**
 * No-cache header for preview/draft mode.
 */
export const NO_CACHE_CONTROL =
  'no-store, no-cache, must-revalidate, proxy-revalidate';

export function getCacheControlHeader(preview: boolean = false) {
  return preview ? NO_CACHE_CONTROL : DEFAULT_CACHE_CONTROL;
}
