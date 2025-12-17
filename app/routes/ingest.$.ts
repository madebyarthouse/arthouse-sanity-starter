import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import type { ANALYTICS_QUERYResult } from '@gen/sanity';
import { loadQuery } from '@/sanity/loader.server';
import { ANALYTICS_QUERY } from '@/sanity/queries';

async function proxy(request: Request) {
  if (process.env.NODE_ENV !== 'production') {
    return new Response('OK', { status: 200 });
  }

  const { data } = await loadQuery<ANALYTICS_QUERYResult>(
    ANALYTICS_QUERY,
    {},
    { perspective: 'published', stega: false }
  );

  const posthog = data?.analytics?.posthog;
  if (!data?.analytics?.enabled || !posthog?.enabled) {
    return new Response('OK', { status: 200 });
  }

  const url = new URL(request.url);
  const isLocalhost =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '::1';
  if (isLocalhost) {
    return new Response('OK', { status: 200 });
  }

  const host = (posthog.host ?? 'https://eu.posthog.com').replace(/\/$/, '');

  // Keep everything after `/ingest` and forward to PostHog.
  const pathname = url.pathname.replace(/^\/ingest/, '') || '/';
  const upstream = new URL(host);
  upstream.pathname = pathname;
  upstream.search = url.search;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const res = await fetch(upstream.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  });

  const resHeaders = new Headers(res.headers);
  return new Response(res.body, { status: res.status, headers: resHeaders });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return proxy(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return proxy(request);
}
