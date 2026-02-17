import { defineField, defineType } from 'sanity';
import { labels } from '@/sanity/i18n';

const l = labels.objects.navLink;

export const navLink = defineType({
  name: 'navLink',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: l.fields.type.title,
      type: 'string',
      initialValue: 'internal',
      options: {
        list: [
          { title: l.fields.type.options.internal, value: 'internal' },
          { title: l.fields.type.options.external, value: 'external' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: l.fields.title.title,
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Internal source',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'Reference', value: 'new' },
          { title: 'Static link', value: 'staticLink' },
        ],
      },
      hidden: ({ parent }) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'staticLink',
      title: 'Static link',
      type: 'reference',
      to: [{ type: 'staticLink' }],
      options: {
        filter: 'type == "internal"',
      },
      hidden: ({ parent }) =>
        parent?.type !== 'internal' || parent?.source !== 'staticLink',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { type?: string; source?: string };
          if (parent?.type !== 'internal' || parent?.source !== 'staticLink')
            return true;
          return value ? true : 'This field is required';
        }),
    }),
    defineField({
      name: 'reference',
      title: l.fields.reference.title,
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) =>
        parent?.type !== 'internal' || parent?.source !== 'new',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { type?: string; source?: string };
          if (parent?.type !== 'internal' || parent?.source !== 'new')
            return true;
          return value ? true : 'This field is required';
        }),
    }),
    defineField({
      name: 'externalLink',
      title: l.fields.externalLink.title,
      type: 'markExternalLink',
      hidden: ({ parent }) => parent?.type !== 'external',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      source: 'source',
      staticLinkUrl: 'staticLink.url',
    },
    prepare({ title, type, source, staticLinkUrl }) {
      const subtitleParts = [type];
      if (type === 'internal' && source === 'staticLink' && staticLinkUrl) {
        subtitleParts.push(staticLinkUrl);
      }
      return {
        title,
        subtitle: subtitleParts.join(' • '),
      };
    },
  },
});
