import { analyticsSettings } from './objects/analytics-settings';
import { complexImage } from './objects/complex-image';
import { ctaLink } from './objects/cta-link';
import { markExternalLink } from './objects/mark-external-link';
import { markInternalLink } from './objects/mark-internal-link';
import { meta } from './objects/meta';
import { metaSettings } from './objects/meta-settings';
import { navLink } from './objects/nav-link';
import { pageBuilderComponent } from './objects/page-builder-component';
import { richText } from './objects/rich-text';
import { separator } from './objects/separator';
import { socialLink } from './objects/social-link';

import { footer } from './documents/footer';
import { header } from './documents/header';
import { page } from './documents/page';
import { siteSettings } from './documents/site-settings';
import { themeSettings } from './documents/theme-settings';

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
];
