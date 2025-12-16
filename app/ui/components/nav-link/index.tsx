import type { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router';
import { resolveHref } from '../../helpers/resolve-href';
import { ExternalLink } from '../links/external-link';

import type {
  FOOTER_QUERYResult,
  HEADER_QUERYResult,
} from '../../../../sanity.types';

type HeaderNavItem = NonNullable<
  NonNullable<HEADER_QUERYResult>['nav']
>[number];
type FooterMainNavItem = NonNullable<
  NonNullable<FOOTER_QUERYResult>['mainNav']
>[number];
type FooterSecondaryNavItem = NonNullable<
  NonNullable<FOOTER_QUERYResult>['secondaryNav']
>[number];

export type NavLinkValue =
  | HeaderNavItem
  | FooterMainNavItem
  | FooterSecondaryNavItem;

type Props = {
  link: NavLinkValue | null | undefined;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export function NavLink({ link, className, children, ...rest }: Props) {
  if (!link) return null;

  const label = children ?? link.title ?? '';

  if (link.type === 'internal') {
    const to = resolveHref(link.reference);
    if (!to) return null;
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    );
  }

  if (link.type === 'external') {
    if (!link.externalLink) return null;
    return (
      <ExternalLink value={link.externalLink} className={className} {...rest}>
        {label}
      </ExternalLink>
    );
  }

  return null;
}
