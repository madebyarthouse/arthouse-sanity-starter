import type { Route } from "./+types/js.script";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const response = await fetch(
      "https://plausible.io/js/script.tagged-events.outbound-links.js"
    );
    const script = await response.text();
    
    return new Response(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Plausible script proxy error:', error);
    return new Response('// Script loading failed', {
      status: 500,
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  }
}
