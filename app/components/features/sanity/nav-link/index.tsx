import type { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router';
import { resolveHref } from '@/components/features/sanity/helpers/resolve-href';
import { ExternalLink } from '@/components/features/sanity/links/external-link';
import { cleanString } from '@/components/features/sanity/helpers/stega';

import type { FOOTER_QUERYResult, HEADER_QUERYResult } from '@gen/sanity';

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

function getInternalLinkTarget(link: NavLinkValue): string | null {
  const source = cleanString(link.source);

  if (source === 'staticLink' && link.staticLink?.url) {
    const rawUrl = cleanString(link.staticLink.url) ?? link.staticLink.url;
    return cleanString(rawUrl) ?? rawUrl;
  }

  if (source === 'new' && link.reference) {
    const resolvedHref = resolveHref(link.reference);
    if (!resolvedHref) {
      return null;
    }

    return cleanString(resolvedHref) ?? resolvedHref;
  }

  return null;
}

export function NavLink({ link, className, children, ...rest }: Props) {
  if (!link) return null;

  const rawLabel = children ?? link.title ?? '';
  const label =
    typeof rawLabel === 'string'
      ? (cleanString(rawLabel) ?? rawLabel)
      : rawLabel;
  if (!label) return null;

  if (link.type === 'internal') {
    const to = getInternalLinkTarget(link);
    if (!to) return null;

    return (
      <Link to={to} className={className} {...rest}>
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
