import type { LoaderFunctionArgs } from 'react-router';
import { getServerConfig } from '@/config';

function getBaseUrl(request: Request): string {
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
      'Cache-Control': 'public, max-age=300',
    },
  });
}
