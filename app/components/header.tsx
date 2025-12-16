import type { HEADER_QUERYResult } from '../../sanity.types';
import { Link } from 'react-router';
import { ComplexImage, NavLink } from '~/ui/components';

interface HeaderProps {
  header: HEADER_QUERYResult | null;
}

export function Header({ header }: HeaderProps) {
  if (!header) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center space-x-8">
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
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
