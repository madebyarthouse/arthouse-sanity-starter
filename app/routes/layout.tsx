import type { Route } from './+types/layout';
import type {
  HEADER_QUERYResult,
  FOOTER_QUERYResult,
  THEME_SETTINGS_QUERYResult,
} from '@gen/sanity';
import type { CSSProperties } from 'react';
import { Outlet } from 'react-router';
import { useQuery } from '@/sanity/loader';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import {
  HEADER_QUERY,
  FOOTER_QUERY,
  THEME_SETTINGS_QUERY,
} from '@/sanity/queries';
import { Header, Footer } from '@/components/features/layout';
import { Container } from '@/components/ui';
import { Hydrated, SanityVisualEditing } from '@/components/features/sanity';

type ThemeCssVars = '--color-background' | '--color-foreground' | '--color-brand';

export async function loader({ request }: Route.LoaderArgs) {
  const { preview, options } = await previewContext(request.headers);

  const [headerData, footerData, themeSettingsData] = await Promise.all([
    loadQuery<HEADER_QUERYResult | null>(HEADER_QUERY, {}, options),
    loadQuery<FOOTER_QUERYResult | null>(FOOTER_QUERY, {}, options),
    loadQuery<THEME_SETTINGS_QUERYResult>(THEME_SETTINGS_QUERY, {}, options),
  ]);

  return {
    preview,
    header: headerData,
    footer: footerData,
    themeSettings: themeSettingsData,
  };
}

export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  const { data: header } = useQuery<HEADER_QUERYResult | null>(
    HEADER_QUERY,
    {},
    { initial: loaderData.header }
  );

  const { data: footer } = useQuery<FOOTER_QUERYResult | null>(
    FOOTER_QUERY,
    {},
    { initial: loaderData.footer }
  );

  const { data: themeSettings } = useQuery<THEME_SETTINGS_QUERYResult>(
    THEME_SETTINGS_QUERY,
    {},
    { initial: loaderData.themeSettings }
  );

  const themeStyle: CSSProperties & Partial<Record<ThemeCssVars, string>> = {};
  if (themeSettings?.backgroundColor) {
    themeStyle['--color-background'] = themeSettings.backgroundColor;
  }
  if (themeSettings?.textColor) {
    themeStyle['--color-foreground'] = themeSettings.textColor;
  }
  if (themeSettings?.brandColor) {
    themeStyle['--color-brand'] = themeSettings.brandColor;
  }

  return (
    <div
      className="bg-background text-foreground flex min-h-screen flex-col antialiased"
      style={themeStyle}
    >
      <Header header={header} />
      <main className="flex-1">
        <Container className="py-10">
          <Outlet />
        </Container>
      </main>
      <Footer footer={footer} />
      {loaderData.preview && (
        <Hydrated>
          <SanityVisualEditing />
        </Hydrated>
      )}
    </div>
  );
}
