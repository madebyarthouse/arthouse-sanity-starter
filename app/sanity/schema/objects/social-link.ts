import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.socialLink;

export const socialLink = defineType({
  name: 'socialLink',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'Custom URL', value: 'new' },
          { title: 'Static link', value: 'staticLink' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'staticLink',
      title: 'Static link',
      type: 'reference',
      to: [{ type: 'staticLink' }],
      options: {
        filter: 'type == "external"',
      },
      hidden: ({ parent }) => parent?.source !== 'staticLink',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { source?: string };
          if (parent?.source !== 'staticLink') return true;
          return value ? true : 'This field is required';
        }),
    }),
    defineField({
      name: 'platform',
      title: l.fields.platform.title,
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Twitter / X', value: 'twitter' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'Pinterest', value: 'pinterest' },
          { title: 'Snapchat', value: 'snapchat' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Telegram', value: 'telegram' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      hidden: ({ parent }) => parent?.source !== 'new',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { source?: string };
          if (parent?.source !== 'new') return true;
          return value ? true : 'This field is required';
        }),
    }),
    defineField({
      name: 'url',
      title: l.fields.url.title,
      type: 'url',
      hidden: ({ parent }) => parent?.source !== 'new',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { source?: string };
          if (parent?.source !== 'new') return true;
          return value ? true : 'This field is required';
        }).uri({ allowRelative: false }),
    }),
  ],
  preview: {
    select: {
      source: 'source',
      staticLinkTitle: 'staticLink.title',
      staticLinkUrl: 'staticLink.url',
      platform: 'platform',
      url: 'url',
    },
    prepare({ source, staticLinkTitle, staticLinkUrl, platform, url }) {
      if (source === 'staticLink') {
        return {
          title: staticLinkTitle || l.title,
          subtitle: staticLinkUrl || 'Static link',
        };
      }
      return {
        title: platform || l.title,
        subtitle: url || '',
      };
    },
  },
});
