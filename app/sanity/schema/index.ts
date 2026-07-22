import { analyticsSettings } from '@/sanity/schema/objects/analytics-settings';
import { complexImage } from '@/sanity/schema/objects/complex-image';
import { ctaLink } from '@/sanity/schema/objects/cta-link';
import { markExternalLink } from '@/sanity/schema/objects/mark-external-link';
import { markInternalLink } from '@/sanity/schema/objects/mark-internal-link';
import { meta } from '@/sanity/schema/objects/meta';
import { metaSettings } from '@/sanity/schema/objects/meta-settings';
import { navLink } from '@/sanity/schema/objects/nav-link';
import { pageBuilderComponent } from '@/sanity/schema/objects/page-builder-component';
import { richText } from '@/sanity/schema/objects/rich-text';
import { separator } from '@/sanity/schema/objects/separator';
import { socialLink } from '@/sanity/schema/objects/social-link';

import { footer } from '@/sanity/schema/documents/footer';
import { header } from '@/sanity/schema/documents/header';
import { page } from '@/sanity/schema/documents/page';
import { siteSettings } from '@/sanity/schema/documents/site-settings';
import { staticLink } from '@/sanity/schema/documents/static-link';
import { themeSettings } from '@/sanity/schema/documents/theme-settings';

export const schemaTypes = [
  // Objects
  meta,
  complexImage,
  separator,
  markExternalLink,
  markInternalLink,
  richText,
  navLink,
  ctaLink,
  socialLink,
  metaSettings,
  analyticsSettings,
  pageBuilderComponent,

  // Documents
  siteSettings,
  themeSettings,
  header,
  footer,
  page,
  staticLink,
];
