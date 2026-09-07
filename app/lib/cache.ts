import { cacheHeader } from 'pretty-cache-header';

/**
 * Browser-facing document cache. HTML points at hashed Vite assets, so
 * browsers should always revalidate with the edge.
 */
export const publicBrowserCacheControl = cacheHeader({
  public: true,
  maxAge: '0s',
});

/**
 * Cloudflare Workers Cache uses `CDN-Cache-Control` when present
 * (`cache.enabled` in wrangler). Short TTL with stale-while-revalidate.
 */
export const publicCdnCacheControl = cacheHeader({
  public: true,
  maxAge: '60s',
  staleWhileRevalidate: '5m',
});

export const noStoreCacheControl = cacheHeader({ noStore: true });

type DocumentCacheHeaders = {
  'Cache-Control': string;
  'CDN-Cache-Control': string;
};

export function getPublicDocumentCacheHeaders(): DocumentCacheHeaders {
  return {
    'Cache-Control': publicBrowserCacheControl,
    'CDN-Cache-Control': publicCdnCacheControl,
  };
}

export function getNoStoreCacheHeaders(): DocumentCacheHeaders {
  return {
    'Cache-Control': noStoreCacheControl,
    'CDN-Cache-Control': noStoreCacheControl,
  };
}

export function getDocumentCacheHeaders(
  preview: boolean
): DocumentCacheHeaders {
  return preview ? getNoStoreCacheHeaders() : getPublicDocumentCacheHeaders();
}

export function headersFromLoaderCache(
  loaderHeaders: Headers
): DocumentCacheHeaders {
  const fallback = getPublicDocumentCacheHeaders();
  return {
    'Cache-Control':
      loaderHeaders.get('Cache-Control') ?? fallback['Cache-Control'],
    'CDN-Cache-Control':
      loaderHeaders.get('CDN-Cache-Control') ?? fallback['CDN-Cache-Control'],
  };
}
