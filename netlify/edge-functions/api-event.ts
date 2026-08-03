type AnalyticsConfig = {
  enabled?: boolean;
  plausible?: {
    enabled?: boolean;
    selfHostedUrl?: string | null;
  } | null;
};

type RuntimeGlobals = typeof globalThis & {
  Netlify?: {
    env: {
      get(name: string): string | undefined;
    };
  };
  Deno?: {
    env?: {
      get(name: string): string | undefined;
    };
  };
};

const runtime = globalThis as RuntimeGlobals;
const analyticsQuery = encodeURIComponent(
  '*[_type == "siteSettings"][0]{analytics{enabled,plausible{enabled,selfHostedUrl}}}',
);

function getEnv(name: string) {
  return runtime.Netlify?.env.get(name) ?? runtime.Deno?.env?.get(name);
}

let configPromise: Promise<AnalyticsConfig | null> | undefined;

async function getAnalyticsConfig() {
  if (!configPromise) {
    configPromise = (async () => {
      const projectId = getEnv('VITE_SANITY_PROJECT_ID');
      const dataset = getEnv('VITE_SANITY_DATASET');
      const apiVersion = getEnv('VITE_SANITY_API_VERSION') ?? '2024-02-13';

      if (!projectId || !dataset) return null;

      const response = await fetch(
        `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${encodeURIComponent(dataset)}?query=${analyticsQuery}`,
      );
      if (!response.ok) return null;

      const payload = (await response.json()) as {
        result?: { analytics?: AnalyticsConfig };
      };
      return payload.result?.analytics ?? null;
    })().catch(() => null);
  }

  return configPromise;
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const analytics = await getAnalyticsConfig();
  if (!analytics?.enabled || !analytics.plausible?.enabled) {
    return new Response('OK', { status: 200 });
  }

  const base = (
    analytics.plausible.selfHostedUrl ?? 'https://plausible.io'
  ).replace(/\/$/, '');
  const headers = new Headers({
    'Content-Type':
      request.headers.get('content-type') ?? 'application/json',
  });
  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-vercel-ip') ||
    request.headers.get('x-nf-client-connection-ip');
  const userAgent = request.headers.get('user-agent');
  if (clientIp) headers.set('X-Forwarded-For', clientIp);
  if (userAgent) headers.set('User-Agent', userAgent);

  try {
    const response = await fetch(`${base}/api/event`, {
      method: 'POST',
      headers,
      body: request.body,
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') ?? 'text/plain',
      },
    });
  } catch {
    return new Response('Bad Gateway', { status: 502 });
  }
}

export const config = {
  path: '/api/event',
};
