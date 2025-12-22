import type { FOOTER_QUERYResult } from '@gen/sanity';
import { Link } from 'react-router';
import { ComplexImage, NavLink } from '@/components/features/sanity';
import { Container } from '@/components/ui';

interface FooterProps {
  footer: FOOTER_QUERYResult | null;
  dataSanity?: string;
}

export function Footer({ footer, dataSanity }: FooterProps) {
  if (!footer) {
    return null;
  }

  return (
    <footer className="border-border bg-muted border-t" data-sanity={dataSanity}>
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
                  {footer.socials.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-foreground text-sm"
                    >
                      {social.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
