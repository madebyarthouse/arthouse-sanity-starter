import type { Route } from './+types/home';
import { useQuery } from '@sanity/react-loader';
import { Welcome } from '../welcome/welcome';
import { loadQuery } from '../sanity/loader.server';
import { previewContext } from '../sanity/preview';
import { Link } from 'react-router';

// Query to get all houses
const query = `*[_type == "house"] | order(title asc){
  _id,
  title,
  address,
  bedrooms
}`;
type House = {
  _id: string;
  title?: string;
  address?: string;
  bedrooms?: number;
};
type Response = House[];

export async function loader({ request }: Route.LoaderArgs) {
  const { options } = await previewContext(request.headers);
  const data = await loadQuery<Response>(query, {}, options);
  return data;
}

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Arthouse - Houses' },
    { name: 'description', content: 'Browse our collection of houses' },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data, encodeDataAttribute } = useQuery(
    query,
    {},
    { initial: loaderData }
  );
  const houses = Array.isArray(data) ? data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Welcome />

      <div className="mt-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Houses</h1>

        {houses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {houses.map((house: House, index: number) => (
              <Link
                key={house._id}
                to={`/house/${house._id}`}
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
                data-sanity={encodeDataAttribute([index])}
              >
                <h2
                  className="mb-2 text-xl font-semibold text-gray-900"
                  data-sanity={encodeDataAttribute([index, 'title'])}
                >
                  {house.title || 'Untitled House'}
                </h2>
                {house.address && (
                  <p
                    className="mb-3 line-clamp-2 text-gray-600"
                    data-sanity={encodeDataAttribute([index, 'address'])}
                  >
                    {house.address}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                  </svg>
                  <span data-sanity={encodeDataAttribute([index, 'bedrooms'])}>
                    {house.bedrooms || 0} bedrooms
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No houses found.</p>
            <p className="mt-2 text-sm text-gray-400">
              Add some houses in your Sanity Studio to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
