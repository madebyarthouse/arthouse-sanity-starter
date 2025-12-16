import type { Route } from './+types/layout';
import type {
  HEADER_QUERYResult,
  FOOTER_QUERYResult,
  SITE_SETTINGS_QUERYResult,
} from '../../sanity.types';
import { Outlet } from 'react-router';
import { useQuery } from '@sanity/react-loader';
import { loadQuery } from '../sanity/loader.server';
import { previewContext } from '../sanity/preview';
import {
  HEADER_QUERY,
  FOOTER_QUERY,
  SITE_SETTINGS_QUERY,
} from '../sanity/queries';
import { SiteSettingsDebug } from '../components/site-settings-debug';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export async function loader({ request }: Route.LoaderArgs) {
  const { options } = await previewContext(request.headers);

  const [headerData, footerData, siteSettingsData] = await Promise.all([
    loadQuery<HEADER_QUERYResult | null>(HEADER_QUERY, {}, options),
    loadQuery<FOOTER_QUERYResult | null>(FOOTER_QUERY, {}, options),
    loadQuery<SITE_SETTINGS_QUERYResult | null>(
      SITE_SETTINGS_QUERY,
      {},
      options
    ),
  ]);

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'layout.tsx:loader:33',
      message: 'Loaded header data',
      data: {
        headerData: JSON.stringify(headerData),
        hasLogo: !!headerData?.data?.logo,
        logoKeys: headerData?.data?.logo
          ? Object.keys(headerData.data.logo)
          : null,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'C',
    }),
  }).catch(() => {});
  // #endregion

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'layout.tsx:loader:36',
      message: 'Loaded footer data',
      data: {
        footerData: JSON.stringify(footerData),
        hasLogo: !!footerData?.data?.logo,
        logoKeys: footerData?.data?.logo
          ? Object.keys(footerData.data.logo)
          : null,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'C',
    }),
  }).catch(() => {});
  // #endregion

  return {
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
      <SiteSettingsDebug siteSettings={siteSettings} />
      <Header header={header} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer footer={footer} />
    </div>
  );
}
