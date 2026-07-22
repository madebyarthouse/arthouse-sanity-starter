import { defineField, defineType } from 'sanity';

export const staticLink = defineType({
  name: 'staticLink',
  title: 'Static Link',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'internal',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'External', value: 'external' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { type?: string };
          if (!value) return 'This field is required';
          if (parent?.type === 'internal' && !value.startsWith('/')) {
            return 'Internal URLs must start with "/"';
          }
          if (parent?.type === 'external' && !value.match(/^https?:\/\//)) {
            return 'External URLs must start with http:// or https://';
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      url: 'url',
    },
    prepare({ title, type, url }) {
      return {
        title,
        subtitle: `${type}: ${url}`,
      };
    },
  },
});
