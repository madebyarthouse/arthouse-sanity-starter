import type { Route } from './+types/page.$slug';
import type { PAGE_QUERYResult } from '../../sanity.types';
import { useQuery } from '@sanity/react-loader';
import { Link, useParams } from 'react-router';
import { loadQuery } from '../sanity/loader.server';
import { previewContext } from '../sanity/preview';
import { PAGE_QUERY } from '../sanity/queries';

export async function loader({ request, params }: Route.LoaderArgs) {
  const { options } = await previewContext(request.headers);
  const data = await loadQuery<PAGE_QUERYResult | null>(
    PAGE_QUERY,
    { slug: params.slug },
    options
  );

  if (!data.data || data.data.meta?.visibility === 'private') {
    throw new Response('Not found', { status: 404 });
  }

  return { page: data };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const page = loaderData.page.data;
  const tags: Route.MetaDescriptors = [
    { title: page?.title ? `${page.title} - Arthouse` : 'Page - Arthouse' },
    {
      name: 'description',
      content: page?.meta?.description || page?.title || 'Page',
    },
  ];

  if (page?.meta?.visibility === 'hidden') {
    tags.push({ name: 'robots', content: 'noindex, nofollow' });
  }

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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
        >
          ← Back home
        </Link>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1
          className="mb-6 text-4xl font-bold text-gray-900"
          data-sanity={encodeDataAttribute(['title'])}
        >
          {page.title || 'Untitled'}
        </h1>

        <p className="mb-4 text-sm text-gray-500">
          Starter render (temporary): showing fetched document JSON.
        </p>
        <pre className="overflow-x-auto text-xs">
          {JSON.stringify(page, null, 2)}
        </pre>
      </div>
    </div>
  );
}
