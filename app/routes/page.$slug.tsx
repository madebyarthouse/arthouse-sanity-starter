import type { Route } from './+types/page.$slug';
import type { PAGE_QUERYResult } from '@gen/sanity';
import { useQuery } from '@/sanity/loader';
import { Link, useParams, data } from 'react-router';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { PAGE_QUERY } from '@/sanity/queries';
import { PageBuilder, RichText } from '@/components/features/sanity';
import { buildRouteMeta } from '@/lib/seo';
import { cleanString } from '@/components/features/sanity/helpers/stega';
import { getCacheControlHeader } from '@/lib/cache';

function cleanVisibility(value: string | null | undefined) {
  return cleanString(value);
}

export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') || '',
});

export async function loader({ request, params }: Route.LoaderArgs) {
  const { preview, options } = await previewContext(request.headers);
  const result = await loadQuery<PAGE_QUERYResult | null>(
    PAGE_QUERY,
    { slug: params.slug },
    options
  );

  const visibility = cleanVisibility(result.data?.meta?.visibility);
  if (!result.data || visibility === 'private') {
    throw new Response('Not found', { status: 404 });
  }

  return data(
    { page: result },
    {
      headers: {
        'Cache-Control': getCacheControlHeader(preview),
      },
    }
  );
}

export function meta({
  loaderData,
  matches,
}: Route.MetaArgs): Route.MetaDescriptors {
  const page = loaderData.page.data;
  const visibility = cleanVisibility(page?.meta?.visibility);

  return buildRouteMeta({
    matches,
    documentTitle: page?.title,
    meta: page?.meta ?? null,
    visibility:
      visibility === 'public' ||
      visibility === 'hidden' ||
      visibility === 'private'
        ? visibility
        : null,
    fallbackTitle: 'Page',
    fallbackDescription: 'Page',
  });
}

export default function PageRoute({ loaderData }: Route.ComponentProps) {
  const { slug = '' } = useParams();
  const { data: page, encodeDataAttribute } = useQuery<PAGE_QUERYResult | null>(
    PAGE_QUERY,
    { slug },
    { initial: loaderData.page }
  );

  if (!page) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Not found</h1>
        <Link to="/" className="text-brand underline-offset-4 hover:underline">
          ← Back home
        </Link>
      </div>
    );
  }

  const contentMode = page.contentMode
    ? (cleanString(page.contentMode) ?? page.contentMode)
    : null;
  const title = cleanString(page.title) ?? page.title ?? 'Untitled';

  if (contentMode === 'pageBuilder') {
    return (
      <div data-sanity={encodeDataAttribute(['components'])}>
        <PageBuilder value={page.components} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link to="/" className="text-brand underline-offset-4 hover:underline">
          ← Back home
        </Link>
      </div>
      <div className="border-border bg-background rounded-lg border p-8">
        <h1
          className="mb-6 text-4xl font-bold"
          data-sanity={encodeDataAttribute(['title'])}
        >
          {title}
        </h1>
        <div
          className="prose max-w-none"
          data-sanity={encodeDataAttribute(['richText'])}
        >
          <RichText value={page.richText} />
        </div>
      </div>
    </div>
  );
}
