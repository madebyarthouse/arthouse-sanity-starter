import type { Route } from './+types/index';
import type { HOMEPAGE_QUERYResult } from '@gen/sanity';
import { useQuery } from '@/sanity/loader';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { HOMEPAGE_QUERY } from '@/sanity/queries';
import { PageBuilder, RichText } from '@/components/features/sanity';
import { buildRouteMeta } from '@/lib/seo';
import { data } from 'react-router';
import { getCacheControlHeader } from '@/lib/cache';
import { cleanString } from '@/components/features/sanity/helpers/stega';

function cleanVisibility(value: string | null | undefined) {
  return cleanString(value);
}

export const headers: Route.HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') || '',
});

export async function loader({ request }: Route.LoaderArgs) {
  const { preview, options } = await previewContext(request.headers);
  const result = await loadQuery<HOMEPAGE_QUERYResult | null>(
    HOMEPAGE_QUERY,
    {},
    options
  );

  const visibility = cleanVisibility(result.data?.meta?.visibility);
  if (result.data && visibility === 'private') {
    throw new Response('Not found', { status: 404 });
  }

  return data(
    { data: result },
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
  const homepage = loaderData.data.data;

  return buildRouteMeta({
    matches,
    documentTitle: homepage?.title,
    meta: homepage?.meta ?? null,
    visibility: (cleanString(homepage?.meta?.visibility) ??
      homepage?.meta?.visibility) as
      | 'public'
      | 'hidden'
      | 'private'
      | null
      | undefined,
    fallbackTitle: 'Homepage',
    fallbackDescription: 'Homepage',
  });
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { data: homepage, encodeDataAttribute } =
    useQuery<HOMEPAGE_QUERYResult | null>(
      HOMEPAGE_QUERY,
      {},
      { initial: loaderData.data }
    );

  const contentMode = homepage?.contentMode
    ? (cleanString(homepage.contentMode) ?? homepage.contentMode)
    : null;

  if (!homepage) {
    return (
      <div className="text-foreground/70 py-12 text-center">
        <p className="text-lg">No homepage content found.</p>
        <p className="mt-2 text-sm">
          Create the homepage in Sanity Studio (page with ID
          &quot;homepage&quot;).
        </p>
      </div>
    );
  }

  const title = cleanString(homepage.title) ?? homepage.title ?? 'Homepage';

  return (
    <div className="mt-12">
      {contentMode === 'pageBuilder' ? null : (
        <h1
          className="mb-8 text-3xl font-bold"
          data-sanity={encodeDataAttribute(['title'])}
        >
          {title}
        </h1>
      )}

      {contentMode === 'pageBuilder' ? (
        <div data-sanity={encodeDataAttribute(['components'])}>
          <PageBuilder value={homepage.components} />
        </div>
      ) : (
        <div
          className="prose max-w-none"
          data-sanity={encodeDataAttribute(['richText'])}
        >
          <RichText value={homepage.richText} />
        </div>
      )}
    </div>
  );
}
