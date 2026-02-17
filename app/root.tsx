import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import { getServerConfig } from '@/config';
import { previewContext } from '@/sanity/preview';
import { getCacheControlHeader } from '@/lib/cache';
import './app.css';

export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') || '',
});

export async function loader({ request }: Route.LoaderArgs) {
  const { preview } = await previewContext(request.headers);

  const ENV = {
    VITE_SANITY_PROJECT_ID: process.env.VITE_SANITY_PROJECT_ID,
    VITE_SANITY_DATASET: process.env.VITE_SANITY_DATASET,
    VITE_SANITY_API_VERSION: process.env.VITE_SANITY_API_VERSION,
    VITE_SANITY_STUDIO_URL: process.env.VITE_SANITY_STUDIO_URL,
  };

  const config = getServerConfig();

  return data(
    { preview, ENV, config },
    {
      headers: {
        'Cache-Control': getCacheControlHeader(preview),
      },
    }
  );
}

export const links: Route.LinksFunction = () => [
  // Intentionally empty in starter mode.
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData('root');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {/* dangerouslySetInnerHTML coming from guide https://www.sanity.io/docs/visual-editing/visual-editing-with-react-router */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
