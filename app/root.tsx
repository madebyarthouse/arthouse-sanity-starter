import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import { getServerConfig } from './config';
import { SanityVisualEditing } from './components/sanity-visual-editing';
import { previewContext } from './sanity/preview';
import './app.css';

export async function loader({ request }: Route.LoaderArgs) {
  const { preview } = await previewContext(request.headers);

  const ENV = {
    PUBLIC_SANITY_PROJECT_ID: process.env.PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET: process.env.PUBLIC_SANITY_DATASET,
    PUBLIC_SANITY_STUDIO_URL: process.env.PUBLIC_SANITY_STUDIO_URL,
  };

  const config = getServerConfig();

  return { preview, ENV, config };
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData('root') as
    | { preview: boolean; ENV: any; config: any }
    | undefined;
  const { preview, ENV, config } = data || {
    preview: false,
    ENV: {},
    config: {
      productionDomain: 'your-domain.com',
      productionUrl: 'https://your-domain.com',
      themeColor: '#000',
    },
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Plausible Analytics Script - DISABLED FOR TESTING */}
        {/* 
        <script
          defer
          data-api="/api/event"
          src="/js/script"
          data-domain={config.productionDomain}
        />
        */}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {preview && <SanityVisualEditing />}
        {/* dangerouslySetInnerHTML coming from guide https://www.sanity.io/docs/visual-editing/visual-editing-with-react-router */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
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
