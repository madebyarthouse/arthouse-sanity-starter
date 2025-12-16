import type { ReactNode } from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type {
  HOMEPAGE_QUERYResult,
  PAGE_QUERYResult,
  RichText as RichTextSchema,
} from '@gen/sanity';
import {
  ComplexImage,
  type ComplexImageValue,
} from '@/components/features/sanity/complex-image';
import {
  ExternalLink,
  type ExternalLinkValue,
} from '@/components/features/sanity/links/external-link';
import {
  InternalLink,
  type InternalLinkValue,
} from '@/components/features/sanity/links/internal-link';

type PageRichText = NonNullable<NonNullable<PAGE_QUERYResult>['richText']>;
type HomepageRichText = NonNullable<
  NonNullable<HOMEPAGE_QUERYResult>['richText']
>;
type PageBuilderBody = NonNullable<
  NonNullable<NonNullable<PAGE_QUERYResult>['components']>[number]['body']
>;
type HomepageBuilderBody = NonNullable<
  NonNullable<NonNullable<HOMEPAGE_QUERYResult>['components']>[number]['body']
>;

export type RichTextValue =
  | RichTextSchema
  | PageRichText
  | HomepageRichText
  | PageBuilderBody
  | HomepageBuilderBody;

type Props = {
  value: RichTextValue | null | undefined;
  components?: Partial<PortableTextComponents>;
};

type ChildrenProps = { children?: ReactNode };
type MarkProps = { children?: ReactNode; value?: unknown };
type TypeProps = { value?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function mergeSection<T>(defaults: T, overrides: T | undefined): T {
  if (!overrides) return defaults;
  if (typeof overrides === 'function') return overrides;
  if (isRecord(defaults) && isRecord(overrides)) {
    return { ...defaults, ...overrides } as T;
  }
  return overrides;
}

export function RichText({ value, components }: Props) {
  if (!value || value.length === 0) return null;

  const defaults: PortableTextComponents = {
    block: {
      h1: ({ children }: ChildrenProps) => (
        <h1 className="text-3xl font-bold">{children}</h1>
      ),
      h2: ({ children }: ChildrenProps) => (
        <h2 className="text-2xl font-bold">{children}</h2>
      ),
      h3: ({ children }: ChildrenProps) => (
        <h3 className="text-xl font-bold">{children}</h3>
      ),
      normal: ({ children }: ChildrenProps) => (
        <p className="leading-relaxed">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }: ChildrenProps) => (
        <ul className="list-disc pl-6">{children}</ul>
      ),
      number: ({ children }: ChildrenProps) => (
        <ol className="list-decimal pl-6">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: ChildrenProps) => <li>{children}</li>,
      number: ({ children }: ChildrenProps) => <li>{children}</li>,
    },
    marks: {
      markExternalLink: ({ children, value }: MarkProps) => (
        <ExternalLink value={value as ExternalLinkValue}>
          {children}
        </ExternalLink>
      ),
      markInternalLink: ({ children, value }: MarkProps) => (
        <InternalLink value={value as InternalLinkValue}>
          {children}
        </InternalLink>
      ),
      code: ({ children }: ChildrenProps) => (
        <code className="rounded bg-gray-100 px-1 py-0.5 text-sm">
          {children}
        </code>
      ),
    },
    types: {
      complexImage: ({ value }: TypeProps) => (
        <ComplexImage value={value as ComplexImageValue} />
      ),
      separator: () => <hr className="my-8 border-gray-200" />,
    },
  };

  const merged: PortableTextComponents = {
    ...defaults,
    ...components,
    block: mergeSection(defaults.block, components?.block),
    list: mergeSection(defaults.list, components?.list),
    listItem: mergeSection(defaults.listItem, components?.listItem),
    marks: mergeSection(defaults.marks, components?.marks),
    types: mergeSection(defaults.types, components?.types),
  };

  // PortableText's TS types are strict about the exact union shape.
  // We keep the public prop typed, and isolate any needed cast here.
  return <PortableText value={value as any} components={merged} />;
}
