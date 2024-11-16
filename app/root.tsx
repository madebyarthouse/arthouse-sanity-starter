import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { config } from "./config";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://cdn.sanity.io" },
];

export const loader = async () => {
  return {
    ENV: {
      VITE_SANITY_PROJECT_ID: import.meta.env.VITE_SANITY_PROJECT_ID!,
      VITE_SANITY_DATASET: import.meta.env.VITE_SANITY_DATASET!,
      VITE_SANITY_API_VERSION: import.meta.env.VITE_SANITY_API_VERSION!,
    },
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { ENV } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          defer
          data-api="/api/event"
          src="/js/script.js"
          data-domain={config.productionDomain}
        ></script>
        {/* <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={config.themeColor}
        /> */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="og:url" content={config.productionUrl} />
        <meta name="og:locale" content="de_AT" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@change me" />
        <meta name="twitter:site" content={config.productionDomain} />
        <meta name="msapplication-TileColor" content={config.themeColor} />
        <meta name="theme-color" content={config.themeColor} />
        <meta name="og:type" content="website" />
        <meta name="og:url" content={config.productionUrl} />
        <meta name="og:image" content={`${config.productionUrl}/og.png`} />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="630" />
        <meta
          name="og:image"
          content={`${config.productionUrl}/og-square.png`}
        />
        <meta name="og:image:width" content="1200" />
        <meta name="og:image:height" content="1200" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
