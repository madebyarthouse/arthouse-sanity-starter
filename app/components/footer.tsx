import type { FOOTER_QUERYResult } from '../../sanity.types';
import { Link } from 'react-router';
import { ComplexImage, NavLink } from '~/ui/components';

interface FooterProps {
  footer: FOOTER_QUERYResult | null;
}

export function Footer({ footer }: FooterProps) {
  if (!footer) {
    return null;
  }

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            {footer.logo ? (
              <Link to="/" className="inline-block">
                <ComplexImage
                  value={footer.logo}
                  sizes="150px"
                  widths={[75, 150, 300]}
                  className="mb-4 h-8 w-[150px]"
                  imgClassName="object-contain"
                  figureClassName="m-0"
                  showBlurPlaceholder={false}
                />
              </Link>
            ) : null}
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Main Navigation
            </h3>
            <ul className="space-y-2">
              {footer.mainNav?.map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    link={item}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-2">
              {footer.secondaryNav?.map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    link={item}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  />
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
