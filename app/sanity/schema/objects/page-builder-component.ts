import { defineField, defineType } from 'sanity';
import { labels } from '../../i18n';

const l = labels.objects.pageBuilderComponent;

// Starter placeholder for the pageBuilder branch. ART-362 expands this into real components.
export const pageBuilderComponent = defineType({
  name: 'pageBuilderComponent',
  title: l.title,
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: l.fields.title.title,
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: l.fields.body.title,
      type: 'richText',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || l.title };
    },
  },
});
