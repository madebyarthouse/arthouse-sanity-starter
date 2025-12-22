import type { Route } from './+types/page.$slug';
import type { PAGE_QUERYResult } from '@gen/sanity';
import { useQuery } from '@/sanity/loader';
import { stegaClean } from '@sanity/client/stega';
import { Link, useParams } from 'react-router';
import { loadQuery } from '@/sanity/loader.server';
import { previewContext } from '@/sanity/preview';
import { PAGE_QUERY } from '@/sanity/queries';
import { PageBuilder, RichText } from '@/components/features/sanity';

function cleanVisibility(value: string | null | undefined) {
  return value ? stegaClean(value) : undefined;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { options } = await previewContext(request.headers);
  const data = await loadQuery<PAGE_QUERYResult | null>(
    PAGE_QUERY,
    { slug: params.slug },
    options
  );

  const visibility = cleanVisibility(data.data?.meta?.visibility);
  if (!data.data || visibility === 'private') {
    throw new Response('Not found', { status: 404 });
  }

  return { page: data };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const page = loaderData.page.data;
  const visibility = cleanVisibility(page?.meta?.visibility);
  const tags: Route.MetaDescriptors = [
    { title: page?.title ? `${page.title} - Arthouse` : 'Page - Arthouse' },
    {
      name: 'description',
      content: page?.meta?.description || page?.title || 'Page',
    },
    {
      name: 'robots',
      content: visibility === 'hidden' ? 'noindex,follow' : 'index,follow',
    },
  ];

  return tags;
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
          {page.title || 'Untitled'}
        </h1>

        <div className="prose max-w-none">
          {(page.contentMode ? stegaClean(page.contentMode) : null) ===
          'pageBuilder' ? (
            <div data-sanity={encodeDataAttribute(['components'])}>
              <PageBuilder value={page.components} />
            </div>
          ) : (
            <div data-sanity={encodeDataAttribute(['richText'])}>
              <RichText value={page.richText} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
