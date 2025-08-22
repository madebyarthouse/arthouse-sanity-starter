import type { Route } from "./+types/api.event";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Extract client IP for proper attribution
  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-vercel-ip') ||
    request.headers.get('x-nf-client-connection-ip');

  const userAgent = request.headers.get('user-agent');

  try {
    const body = await request.text();
    
    const response = await fetch("https://plausible.io/api/event", {
      body,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        ...(clientIp && { "X-Forwarded-For": clientIp }),
        ...(userAgent && { "User-Agent": userAgent }),
      },
    });

    const responseBody = await response.text();
    
    return new Response(responseBody, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Plausible event proxy error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
