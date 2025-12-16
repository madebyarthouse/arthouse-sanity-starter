import type { HEADER_QUERYResult } from '../../sanity.types';
import { SanityImage } from './sanity-image';

interface HeaderProps {
  header: HEADER_QUERYResult | null;
}

export function Header({ header }: HeaderProps) {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'header.tsx:9',
      message: 'Header component entry',
      data: {
        hasHeader: !!header,
        hasLogo: !!header?.logo,
        logoStructure: header?.logo ? JSON.stringify(header.logo) : null,
        hasAsset: !!header?.logo?.asset,
        assetType: typeof header?.logo?.asset,
        assetKeys: header?.logo?.asset ? Object.keys(header.logo.asset) : null,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'D,E',
    }),
  }).catch(() => {});
  // #endregion

  if (!header) {
    return null;
  }

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'header.tsx:19',
      message: 'Before logo render check',
      data: {
        logoAssetCheck: !!header.logo?.asset,
        willRender: !!header.logo?.asset,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'C,D',
    }),
  }).catch(() => {});
  // #endregion

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center space-x-8">
          {header.logo?.asset && (
            <SanityImage
              image={header.logo as any}
              alt={header.logo.alt || 'Logo'}
              width={200}
              height={40}
              sizes="200px"
              widths={[100, 200, 400]}
              className="h-10 w-auto"
              priority
            />
          )}
          <nav className="hidden space-x-6 md:flex">
            {header.nav?.map((item, idx) => (
              <a
                key={idx}
                href={
                  item.type === 'internal'
                    ? `/${item.reference?.slug?.current || ''}`
                    : item.externalLink?.url || '#'
                }
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
