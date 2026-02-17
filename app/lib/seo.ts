import type { MetaDescriptor } from 'react-router';
import type { PAGE_QUERYResult, SITE_SETTINGS_QUERYResult } from '@gen/sanity';
import { urlFor } from '@/lib/sanity-image';
import { cleanString } from '@/components/features/sanity/helpers/stega';

type Matches = ReadonlyArray<{ data?: unknown } | undefined>;

type VisibilityValue = 'public' | 'hidden' | 'private';

type PageMeta = NonNullable<NonNullable<PAGE_QUERYResult>['meta']>;
type OgImageSource =
  | NonNullable<PageMeta['ogImage']>
  | NonNullable<
      NonNullable<
        NonNullable<SITE_SETTINGS_QUERYResult>['metaSettings']
      >['defaultOgImage']
    >;

type MetaLike = {
  title?: string | null;
  description?: string | null;
  keywords?: Array<string | null> | null;
  ogImage?: OgImageSource | null;
};

type MatchSiteSettingsData = {
  data?: SITE_SETTINGS_QUERYResult | null;
};

function joinKeywords(value: Array<string | null> | null | undefined): string {
  return (value ?? []).map(cleanString).filter(Boolean).join(', ');
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isMatchSiteSettingsData(
  value: unknown
): value is MatchSiteSettingsData {
  return isObjectRecord(value) && 'data' in value;
}

function extractSiteSettingsFromMatchData(
  data: unknown
): SITE_SETTINGS_QUERYResult | null | undefined {
  if (!isObjectRecord(data)) {
    return undefined;
  }

  const siteSettings = data.siteSettings;
  if (!isMatchSiteSettingsData(siteSettings)) {
    return undefined;
  }

  const siteSettingsData = siteSettings.data;
  if (siteSettingsData === undefined) {
    return undefined;
  }

  return siteSettingsData ?? null;
}

function formatTitle({
  baseTitle,
  siteTitle,
  titleTemplate,
}: {
  baseTitle: string;
  siteTitle?: string;
  titleTemplate?: string;
}): string {
  const template = cleanString(titleTemplate);
  const cleanSiteTitle = cleanString(siteTitle);

  if (template) {
    if (template.includes('%s')) return template.replace('%s', baseTitle);
    return `${baseTitle} ${template}`;
  }

  return cleanSiteTitle ? `${baseTitle} - ${cleanSiteTitle}` : baseTitle;
}

export function getSiteSettingsFromMatches(
  matches: Matches
): SITE_SETTINGS_QUERYResult | null {
  for (const match of matches) {
    if (!match) {
      continue;
    }

    const siteSettings = extractSiteSettingsFromMatchData(match.data);
    if (siteSettings !== undefined) {
      return siteSettings;
    }
  }

  return null;
}

export function buildRouteMeta({
  matches,
  documentTitle,
  meta,
  visibility,
  fallbackTitle,
  fallbackDescription,
}: {
  matches: Matches;
  documentTitle?: string | null;
  meta?: MetaLike | null;
  visibility?: VisibilityValue | null;
  fallbackTitle: string;
  fallbackDescription: string;
}): Array<MetaDescriptor> {
  const siteSettings = getSiteSettingsFromMatches(matches);
  const metaSettings = siteSettings?.metaSettings ?? null;

  const siteTitle = metaSettings?.siteTitle ?? null;
  const baseTitle =
    cleanString(meta?.title) ??
    cleanString(documentTitle) ??
    cleanString(siteTitle) ??
    fallbackTitle;

  const fullTitle = formatTitle({
    baseTitle,
    siteTitle: siteTitle ?? undefined,
    titleTemplate: metaSettings?.titleTemplate ?? undefined,
  });

  const description =
    cleanString(meta?.description) ??
    cleanString(metaSettings?.defaultDescription) ??
    cleanString(documentTitle) ??
    fallbackDescription;

  const keywords =
    joinKeywords(meta?.keywords ?? null) ||
    joinKeywords(metaSettings?.defaultKeywords ?? null);

  const ogSource = meta?.ogImage ?? metaSettings?.defaultOgImage;
  const ogImageUrl = ogSource
    ? urlFor(ogSource).width(1200).height(630).fit('crop').auto('format').url()
    : null;

  const robots = visibility === 'hidden' ? 'noindex,follow' : 'index,follow';

  const tags: Array<MetaDescriptor> = [
    { title: fullTitle },
    { name: 'description', content: description },
    { name: 'robots', content: robots },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
  ];

  if (keywords) {
    tags.push({ name: 'keywords', content: keywords });
  }

  if (ogImageUrl) {
    tags.push({ property: 'og:image', content: ogImageUrl });
  }

  return tags;
}
