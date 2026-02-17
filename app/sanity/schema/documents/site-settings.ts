import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.documents.siteSettings;

export const siteSettings = defineType({
  name: 'siteSettings',
  title: l.title,
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'legal', title: 'Legal' },
    { name: 'analytics', title: 'Analytics' },
  ],
  fields: [
    defineField({
      name: 'metaSettings',
      title: l.fields.metaSettings.title,
      type: 'metaSettings',
      group: 'seo',
    }),
    defineField({
      name: 'favicon',
      title: l.fields.favicon.title,
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'ogVisual',
      title: l.fields.ogVisual.title,
      type: 'complexImage',
      group: 'seo',
    }),
    defineField({
      name: 'socials',
      title: l.fields.socials.title,
      type: 'array',
      group: 'general',
      of: [{ type: 'socialLink' }],
    }),
    defineField({
      name: 'contactCta',
      title: 'Contact CTA',
      type: 'ctaLink',
      group: 'general',
    }),
    defineField({
      name: 'privacyPolicy',
      title: l.fields.privacyPolicy.title,
      type: 'reference',
      group: 'legal',
      to: [{ type: 'page' }],
    }),
    defineField({
      name: 'imprint',
      title: l.fields.imprint.title,
      type: 'reference',
      group: 'legal',
      to: [{ type: 'page' }],
    }),
    defineField({
      name: 'analytics',
      title: l.fields.analytics.title,
      type: 'analyticsSettings',
      group: 'analytics',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: l.title,
      };
    },
  },
});
