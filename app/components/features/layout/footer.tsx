import type { FOOTER_QUERYResult } from '@gen/sanity';
import { Link } from 'react-router';
import { ComplexImage, NavLink } from '@/components/features/sanity';
import { Container } from '@/components/ui';
import { cleanString } from '@/components/features/sanity/helpers/stega';

interface FooterProps {
  footer: FOOTER_QUERYResult | null;
  dataSanity?: string;
}

function getSocialHref(
  social: NonNullable<NonNullable<FOOTER_QUERYResult>['socials']>[number]
): string | undefined {
  const source = cleanString(social.source);
  const raw =
    source === 'staticLink'
      ? (social.staticLink?.url ?? undefined)
      : (social.url ?? undefined);
  if (!raw) return undefined;
  return cleanString(raw) ?? raw;
}

function getSocialLabel(
  social: NonNullable<NonNullable<FOOTER_QUERYResult>['socials']>[number]
): string {
  const source = cleanString(social.source);
  if (source === 'staticLink') {
    const titleRaw = social.staticLink?.title || 'SOCIAL';
    return cleanString(titleRaw) ?? titleRaw;
  }
  const platformRaw = social.platform || 'SOCIAL';
  return (cleanString(platformRaw) ?? platformRaw).toUpperCase();
}

export function Footer({ footer, dataSanity }: FooterProps) {
  if (!footer) {
    return null;
  }

  return (
    <footer
      className="border-border bg-muted border-t"
      data-sanity={dataSanity}
    >
      <Container className="py-12">
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
            <h3 className="text-foreground mb-4 text-sm font-semibold">
              Main Navigation
            </h3>
            <ul className="space-y-2">
              {footer.mainNav?.map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    link={item}
                    className="text-foreground/80 hover:text-foreground text-sm"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold">
              Legal
            </h3>
            <ul className="space-y-2">
              {footer.secondaryNav?.map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    link={item}
                    className="text-foreground/80 hover:text-foreground text-sm"
                  />
                </li>
              ))}
            </ul>
            {footer.socials && footer.socials.length > 0 && (
              <div className="mt-4">
                <h4 className="text-foreground mb-2 text-sm font-semibold">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  {footer.socials.map((social, idx) =>
                    (() => {
                      const href = getSocialHref(social);
                      if (!href) return null;
                      return (
                        <a
                          key={idx}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/80 hover:text-foreground text-sm"
                        >
                          {getSocialLabel(social)}
                        </a>
                      );
                    })()
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
