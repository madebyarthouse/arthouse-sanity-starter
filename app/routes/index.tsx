import type { Route } from './+types/index';
import type { HOMEPAGE_QUERYResult } from '@gen/sanity';
import { useQuery } from '@/sanity/loader';
import { stegaClean } from '@sanity/client/stega';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { HOMEPAGE_QUERY } from '@/sanity/queries';
import { PageBuilder, RichText } from '@/components/features/sanity';

function cleanVisibility(value: string | null | undefined) {
  return value ? stegaClean(value) : undefined;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { options } = await previewContext(request.headers);
  const data = await loadQuery<HOMEPAGE_QUERYResult | null>(
    HOMEPAGE_QUERY,
    {},
    options
  );

  const visibility = cleanVisibility(data.data?.meta?.visibility);
  if (data.data && visibility === 'private') {
    throw new Response('Not found', { status: 404 });
  }

  return { data };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const homepage = loaderData.data.data;
  const visibility = cleanVisibility(homepage?.meta?.visibility);

  return [
    { title: homepage?.title ? `${homepage.title} - Arthouse` : 'Arthouse' },
    {
      name: 'description',
      content: homepage?.meta?.description || homepage?.title || 'Homepage',
    },
    {
      name: 'robots',
      content: visibility === 'hidden' ? 'noindex,follow' : 'index,follow',
    },
  ];
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { data: homepage, encodeDataAttribute } =
    useQuery<HOMEPAGE_QUERYResult | null>(
      HOMEPAGE_QUERY,
      {},
      { initial: loaderData.data }
    );

  const contentMode = homepage?.contentMode
    ? stegaClean(homepage.contentMode)
    : null;

  return (
    <div className="mt-12">
      <h1
        className="mb-8 text-3xl font-bold"
        data-sanity={encodeDataAttribute(['title'])}
      >
        {homepage?.title || 'Homepage'}
      </h1>

      {!homepage ? (
        <div className="text-foreground/70 py-12 text-center">
          <p className="text-lg">No homepage content found.</p>
          <p className="mt-2 text-sm">
            Create the homepage in Sanity Studio (page with ID "homepage").
          </p>
        </div>
      ) : (
        <div className="prose max-w-none">
          {contentMode === 'pageBuilder' ? (
            <div data-sanity={encodeDataAttribute(['components'])}>
              <PageBuilder value={homepage.components} />
            </div>
          ) : (
            <div data-sanity={encodeDataAttribute(['richText'])}>
              <RichText value={homepage.richText} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
