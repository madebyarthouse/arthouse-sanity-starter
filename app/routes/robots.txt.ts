import type { LoaderFunctionArgs } from 'react-router';
import { getServerConfig } from '../config';

function getBaseUrl(request: Request): string {
  // Prefer explicit production URL when provided, otherwise use current origin.
  if (process.env.PRODUCTION_URL) return getServerConfig().productionUrl;
  return new URL(request.url).origin;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const baseUrl = getBaseUrl(request).replace(/\/$/, '');

  const body = [
    'User-agent: *',
    'Disallow: /studio',
    'Disallow: /api/',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Keep it safe to cache briefly; deployments can override at the edge.
      'Cache-Control': 'public, max-age=300',
    },
  });
}

