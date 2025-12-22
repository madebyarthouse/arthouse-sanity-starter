import type { ReactNode } from 'react';
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
  type PortableTextTypeComponentProps,
} from '@portabletext/react';
import type {
  ComplexImage as ComplexImageSchema,
  HOMEPAGE_QUERYResult,
  PAGE_QUERYResult,
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
  | PageRichText
  | HomepageRichText
  | PageBuilderBody
  | HomepageBuilderBody;

type Props = {
  value: RichTextValue | null | undefined;
};

type ChildrenProps = { children?: ReactNode };

type MarkInternalLinkDeref = {
  _type: 'markInternalLink';
  _key?: string;
  link?: { _id: string; _type: 'page'; slug: { current?: string | null } | null } | null;
};

type MarkExternalLinkValue = NonNullable<
  NonNullable<PageRichText[number]>['markDefs']
>[number] & { _type: 'markExternalLink' };

export function RichText({ value }: Props) {
  if (!value?.length) return null;

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
      markExternalLink: ({
        children,
        value,
      }: PortableTextMarkComponentProps<MarkExternalLinkValue>) => (
        <ExternalLink value={value ?? null}>
          {children}
        </ExternalLink>
      ),
      markInternalLink: ({
        children,
        value,
      }: PortableTextMarkComponentProps<MarkInternalLinkDeref>) => (
        <InternalLink value={value ?? null}>
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
      complexImage: ({
        value,
      }: PortableTextTypeComponentProps<ComplexImageSchema & { _key?: string }>) => (
        <ComplexImage value={value} />
      ),
      separator: () => <hr className="my-8 border-gray-200" />,
    },
  };

  return <PortableText value={value} components={defaults} />;
}
