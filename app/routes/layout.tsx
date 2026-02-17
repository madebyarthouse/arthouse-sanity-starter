import type { Route } from './+types/layout';
import type {
  HEADER_QUERYResult,
  FOOTER_QUERYResult,
  SITE_SETTINGS_QUERYResult,
  THEME_SETTINGS_QUERYResult,
} from '@gen/sanity';
import type { CSSProperties, ReactNode } from 'react';
import { isRouteErrorResponse, Outlet, useMatches, data } from 'react-router';
import { useQuery } from '@/sanity/loader';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { getCacheControlHeader } from '@/lib/cache';
import {
  HEADER_QUERY,
  FOOTER_QUERY,
  SITE_SETTINGS_QUERY,
  THEME_SETTINGS_QUERY,
} from '@/sanity/queries';
import {
  Footer,
  Header,
  SiteSettingsProvider,
} from '@/components/features/layout';
import { Hydrated, SanityVisualEditing } from '@/components/features/sanity';
import { AnalyticsProvider } from '@/components/features/analytics';
import { Container } from '@/components/ui';
import { cleanString } from '@/components/features/sanity/helpers/stega';

type ThemeCssVars =
  | '--color-background'
  | '--color-foreground'
  | '--color-brand';

export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') || '',
});

export async function loader({ request }: Route.LoaderArgs) {
  const { preview, options } = await previewContext(request.headers);

  const [headerData, footerData, siteSettingsData, themeSettingsData] =
    await Promise.all([
      loadQuery<HEADER_QUERYResult | null>(HEADER_QUERY, {}, options),
      loadQuery<FOOTER_QUERYResult | null>(FOOTER_QUERY, {}, options),
      loadQuery<SITE_SETTINGS_QUERYResult | null>(
        SITE_SETTINGS_QUERY,
        {},
        options
      ),
      loadQuery<THEME_SETTINGS_QUERYResult>(THEME_SETTINGS_QUERY, {}, options),
    ]);

  return data(
    {
      preview,
      header: headerData,
      footer: footerData,
      siteSettings: siteSettingsData,
      themeSettings: themeSettingsData,
    },
    {
      headers: {
        'Cache-Control': getCacheControlHeader(preview),
      },
    }
  );
}

type LayoutLoaderData = Route.ComponentProps['loaderData'];

function getLayoutMatchData(
  matches: ReturnType<typeof useMatches>
): LayoutLoaderData | null {
  const match = matches.find((m) => {
    const id = String(m.id ?? '');
    return (
      id === 'routes/layout' ||
      id === 'routes/layout.tsx' ||
      id.endsWith('/routes/layout') ||
      id.endsWith('/routes/layout.tsx') ||
      id.endsWith('routes/layout') ||
      id.endsWith('routes/layout.tsx')
    );
  });

  return (match?.data as LayoutLoaderData | undefined) ?? null;
}

function SiteShell({
  loaderData,
  children,
}: {
  loaderData: LayoutLoaderData;
  children: ReactNode;
}) {
  const { data: header, encodeDataAttribute: encodeHeaderDataAttribute } =
    useQuery<HEADER_QUERYResult | null>(
      HEADER_QUERY,
      {},
      {
        initial: loaderData.header,
      }
    );

  const { data: footer, encodeDataAttribute: encodeFooterDataAttribute } =
    useQuery<FOOTER_QUERYResult | null>(
      FOOTER_QUERY,
      {},
      {
        initial: loaderData.footer,
      }
    );

  const {
    data: siteSettings,
    encodeDataAttribute: encodeSiteSettingsDataAttribute,
  } = useQuery<SITE_SETTINGS_QUERYResult | null>(
    SITE_SETTINGS_QUERY,
    {},
    {
      initial: loaderData.siteSettings,
    }
  );

  const {
    data: themeSettings,
    encodeDataAttribute: encodeThemeSettingsDataAttribute,
  } = useQuery<THEME_SETTINGS_QUERYResult>(
    THEME_SETTINGS_QUERY,
    {},
    {
      initial: loaderData.themeSettings,
    }
  );

  const headerSanity = encodeHeaderDataAttribute(['nav']);
  const footerSanity = encodeFooterDataAttribute(['mainNav']);
  const siteSettingsSanity = encodeSiteSettingsDataAttribute(['analytics']);
  const themeSettingsSanity = encodeThemeSettingsDataAttribute(['brandColor']);

  const themeStyle: CSSProperties & Partial<Record<ThemeCssVars, string>> = {};
  if (themeSettings?.backgroundColor) {
    themeStyle['--color-background'] = cleanString(
      themeSettings.backgroundColor
    );
  }
  if (themeSettings?.textColor) {
    themeStyle['--color-foreground'] = cleanString(themeSettings.textColor);
  }
  if (themeSettings?.brandColor) {
    themeStyle['--color-brand'] = cleanString(themeSettings.brandColor);
  }

  return (
    <AnalyticsProvider config={siteSettings?.analytics}>
      <SiteSettingsProvider
        value={siteSettings}
        encodeDataAttribute={encodeSiteSettingsDataAttribute}
      >
        <div
          className="bg-background text-foreground flex min-h-screen flex-col antialiased"
          style={themeStyle}
        >
          <Header header={header} dataSanity={headerSanity} />
          <main className="flex-1" data-sanity={siteSettingsSanity}>
            <div hidden data-sanity={themeSettingsSanity} />
            <Container className="py-10">{children}</Container>
          </main>
          <Footer footer={footer} dataSanity={footerSanity} />
          {loaderData.preview && (
            <Hydrated>
              <SanityVisualEditing />
            </Hydrated>
          )}
        </div>
      </SiteSettingsProvider>
    </AnalyticsProvider>
  );
}

export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  return (
    <SiteShell loaderData={loaderData}>
      <Outlet />
    </SiteShell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const matches = useMatches();
  const loaderData = getLayoutMatchData(matches);

  let title = 'Something went wrong';
  let description = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page not found' : `Error ${error.status}`;
    description = error.statusText || description;
  } else if (import.meta.env.DEV && error instanceof Error) {
    description = error.message;
    stack = error.stack;
  }

  const content = (
    <div className="mx-auto max-w-[720px] py-16">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h1>
      <p className="text-foreground/70 mt-3 leading-relaxed">{description}</p>
      {stack ? (
        <pre className="border-border bg-muted/40 mt-6 overflow-x-auto rounded-xl border p-4 text-sm">
          <code>{stack}</code>
        </pre>
      ) : null}
    </div>
  );

  if (!loaderData) {
    return <main className="container mx-auto p-4 pt-16">{content}</main>;
  }

  return <SiteShell loaderData={loaderData}>{content}</SiteShell>;
}
