import { defineType } from 'sanity';
import { labels } from '../../i18n';

const l = labels.objects.richText;

export const richText = defineType({
  name: 'richText',
  title: l.title,
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: l.styles.normal, value: 'normal' },
        { title: l.styles.h1, value: 'h1' },
        { title: l.styles.h2, value: 'h2' },
        { title: l.styles.h3, value: 'h3' },
      ],
      lists: [
        { title: l.lists.bullet, value: 'bullet' },
        { title: l.lists.number, value: 'number' },
      ],
      marks: {
        decorators: [
          { title: l.decorators.strong, value: 'strong' },
          { title: l.decorators.em, value: 'em' },
          { title: l.decorators.code, value: 'code' },
        ],
        annotations: [
          { type: 'markExternalLink' },
          { type: 'markInternalLink' },
        ],
      },
    },
    { type: 'complexImage' },
    { type: 'separator' },
  ],
});
