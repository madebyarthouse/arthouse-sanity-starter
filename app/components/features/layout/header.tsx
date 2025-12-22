import type { HEADER_QUERYResult } from '@gen/sanity';
import { Link } from 'react-router';
import { ComplexImage, NavLink } from '@/components/features/sanity';
import { Container } from '@/components/ui';

interface HeaderProps {
  header: HEADER_QUERYResult | null;
  dataSanity?: string;
}

export function Header({ header, dataSanity }: HeaderProps) {
  if (!header) {
    return null;
  }

  return (
    <header className="border-border bg-background border-b" data-sanity={dataSanity}>
      <Container className="flex items-center justify-between py-6">
        <div className="flex items-center gap-8">
          {header.logo ? (
            <Link to="/" className="block">
              <ComplexImage
                value={header.logo}
                sizes="200px"
                widths={[100, 200, 400]}
                className="h-10 w-[200px]"
                imgClassName="object-contain"
                figureClassName="m-0"
                priority
                showBlurPlaceholder={false}
              />
            </Link>
          ) : null}
          <nav className="hidden space-x-6 md:flex">
            {header.nav?.map((item, idx) => (
              <NavLink
                key={idx}
                link={item}
                className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors"
              />
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
