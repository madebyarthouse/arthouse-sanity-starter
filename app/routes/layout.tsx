import type { Route } from './+types/layout';
import type {
  HEADER_QUERYResult,
  FOOTER_QUERYResult,
  SITE_SETTINGS_QUERYResult,
} from '../../sanity.types';
import { Outlet } from 'react-router';
import { useQuery } from '~/sanity/loader';
import { loadQuery } from '../sanity/loader.server';
import { previewContext } from '../sanity/preview';
import {
  HEADER_QUERY,
  FOOTER_QUERY,
  SITE_SETTINGS_QUERY,
} from '../sanity/queries';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Hydrated } from '../components/hydrated';
import { SanityVisualEditing } from '../components/sanity-visual-editing';

export async function loader({ request }: Route.LoaderArgs) {
  const { preview, options } = await previewContext(request.headers);

  const [headerData, footerData, siteSettingsData] = await Promise.all([
    loadQuery<HEADER_QUERYResult | null>(HEADER_QUERY, {}, options),
    loadQuery<FOOTER_QUERYResult | null>(FOOTER_QUERY, {}, options),
    loadQuery<SITE_SETTINGS_QUERYResult | null>(
      SITE_SETTINGS_QUERY,
      {},
      options
    ),
  ]);

  return {
    preview,
    header: headerData,
    footer: footerData,
    siteSettings: siteSettingsData,
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

  const { data: siteSettings } = useQuery<SITE_SETTINGS_QUERYResult | null>(
    SITE_SETTINGS_QUERY,
    {},
    { initial: loaderData.siteSettings }
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header header={header} />
      <main className="flex-1">
        <Outlet />
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
