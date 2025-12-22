import type {
  HOMEPAGE_QUERYResult,
  PAGE_QUERYResult,
} from '@gen/sanity';
import { RichText } from '@/components/features/sanity/rich-text';

type PageComponents = NonNullable<NonNullable<PAGE_QUERYResult>['components']>;
type HomepageComponents = NonNullable<
  NonNullable<HOMEPAGE_QUERYResult>['components']
>;
export type PageBuilderValue = PageComponents | HomepageComponents;

type Props = {
  value: PageBuilderValue | null | undefined;
};

export function PageBuilder({ value }: Props) {
  if (!value || value.length === 0) return null;

  return (
    <div className="space-y-10">
      {value.map((section, idx) => (
        <section key={section.title ?? String(idx)}>
          {section.title ? (
            <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
          ) : null}
          <RichText value={section.body} />
        </section>
      ))}
    </div>
  );
}
