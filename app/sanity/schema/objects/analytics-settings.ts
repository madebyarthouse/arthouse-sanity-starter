import { defineField, defineType } from 'sanity';
import { labels } from '../../i18n';

const l = labels.objects.analyticsSettings;

export const analyticsSettings = defineType({
  name: 'analyticsSettings',
  title: l.title,
  type: 'object',
  description: l.description,
  fields: [
    defineField({
      name: 'enabled',
      title: l.fields.enabled.title,
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'provider',
      title: l.fields.provider.title,
      type: 'string',
      initialValue: 'plausible',
      options: {
        list: [{ title: 'Plausible', value: 'plausible' }],
      },
    }),
    defineField({
      name: 'domain',
      title: l.fields.domain.title,
      type: 'string',
      description: l.fields.domain.description,
    }),
  ],
});
