import type { Route } from './+types/index';
import type { HOMEPAGE_QUERYResult } from '../../sanity.types';
import { useQuery } from '@sanity/react-loader';
import { loadQuery } from '../sanity/loader.server';
import { previewContext } from '../sanity/preview';
import { HOMEPAGE_QUERY } from '../sanity/queries';

export async function loader({ request }: Route.LoaderArgs) {
  const { options } = await previewContext(request.headers);
  const data = await loadQuery<HOMEPAGE_QUERYResult | null>(
    HOMEPAGE_QUERY,
    {},
    options
  );

  return { data };
}

export function meta(): Route.MetaDescriptors {
  return [{ title: 'Arthouse' }, { name: 'description', content: 'Homepage' }];
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { data: homepage, encodeDataAttribute } =
    useQuery<HOMEPAGE_QUERYResult | null>(
      HOMEPAGE_QUERY,
      {},
      { initial: loaderData.data }
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-12">
        <h1
          className="mb-8 text-3xl font-bold text-gray-900"
          data-sanity={encodeDataAttribute(['title'])}
        >
          {homepage?.title || 'Homepage'}
        </h1>

        {!homepage ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No homepage content found.</p>
            <p className="mt-2 text-sm text-gray-400">
              Create the homepage in Sanity Studio (page with ID "homepage").
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm text-gray-500">
              Starter render (temporary): showing fetched document JSON.
            </p>
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(homepage, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
