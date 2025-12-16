import type { FOOTER_QUERYResult } from '../../sanity.types';
import { SanityImage } from './sanity-image';

interface FooterProps {
  footer: FOOTER_QUERYResult | null;
}

export function Footer({ footer }: FooterProps) {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'footer.tsx:9',
      message: 'Footer component entry',
      data: {
        hasFooter: !!footer,
        hasLogo: !!footer?.logo,
        logoStructure: footer?.logo ? JSON.stringify(footer.logo) : null,
        hasAsset: !!footer?.logo?.asset,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'C,D',
    }),
  }).catch(() => {});
  // #endregion

  if (!footer) {
    return null;
  }

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            {footer.logo?.asset && (
              <SanityImage
                image={footer.logo as any}
                alt={footer.logo.alt || 'Logo'}
                width={150}
                height={32}
                sizes="150px"
                widths={[75, 150, 300]}
                className="mb-4 h-8 w-auto"
              />
            )}
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Main Navigation
            </h3>
            <ul className="space-y-2">
              {footer.mainNav?.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={
                      item.type === 'internal'
                        ? `/${item.reference?.slug?.current || ''}`
                        : item.externalLink?.url || '#'
                    }
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-2">
              {footer.secondaryNav?.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={
                      item.type === 'internal'
                        ? `/${item.reference?.slug?.current || ''}`
                        : item.externalLink?.url || '#'
                    }
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            {footer.socials && footer.socials.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  {footer.socials.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {social.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
