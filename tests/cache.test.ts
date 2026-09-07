import { describe, expect, it } from 'vitest';
import {
  getDocumentCacheHeaders,
  getNoStoreCacheHeaders,
  getPublicDocumentCacheHeaders,
  headersFromLoaderCache,
  noStoreCacheControl,
  publicBrowserCacheControl,
  publicCdnCacheControl,
} from '@/lib/cache';

describe('document cache headers', () => {
  it('sends browser max-age=0 and CDN SWR for public documents', () => {
    expect(publicBrowserCacheControl).toBe('public, max-age=0');
    expect(publicCdnCacheControl).toBe(
      'public, max-age=60, stale-while-revalidate=300'
    );

    const headers = getPublicDocumentCacheHeaders();
    expect(headers['Cache-Control']).toBe('public, max-age=0');
    expect(headers['CDN-Cache-Control']).toBe(
      'public, max-age=60, stale-while-revalidate=300'
    );
    expect(getDocumentCacheHeaders(false)).toEqual(headers);
  });

  it('sends no-store on both headers for preview and proxies', () => {
    expect(noStoreCacheControl).toBe('no-store');

    const headers = getNoStoreCacheHeaders();
    expect(headers['Cache-Control']).toBe('no-store');
    expect(headers['CDN-Cache-Control']).toBe('no-store');
    expect(getDocumentCacheHeaders(true)).toEqual(headers);
  });

  it('forwards loader cache headers and fills in CDN-Cache-Control', () => {
    const loaderHeaders = new Headers({
      'Cache-Control': 'public, max-age=0',
    });
    const headers = headersFromLoaderCache(loaderHeaders);

    expect(headers['Cache-Control']).toBe('public, max-age=0');
    expect(headers['CDN-Cache-Control']).toBe(
      'public, max-age=60, stale-while-revalidate=300'
    );
  });
});
