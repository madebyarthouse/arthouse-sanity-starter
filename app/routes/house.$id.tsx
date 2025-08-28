import type { Route } from './+types/house.$id';
import type { SanityDocument } from '@sanity/client';
import { useQuery } from '@sanity/react-loader';
import { Link } from 'react-router';
import { loadQuery } from '../sanity/loader.server';
import { previewContext } from '../sanity/preview';

// Query to get a specific house by ID
const query = `*[_type == "house" && _id == $id][0]{
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

type Response = SanityDocument<House>;

export async function loader({ request, params }: Route.LoaderArgs) {
  const { options } = await previewContext(request.headers);
  const data = await loadQuery<Response>(query, { id: params.id }, options);

  if (!data.data) {
    throw new Response('House not found', { status: 404 });
  }

  return data;
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptor[] {
  const house = loaderData?.data;
  return [
    { title: house?.title ? `${house.title} - Arthouse` : 'House - Arthouse' },
    { name: 'description', content: house?.address || 'House details' },
  ];
}

export default function HouseDetail({ loaderData }: Route.ComponentProps) {
  const { data: house, encodeDataAttribute } = useQuery(
    query,
    { id: loaderData.data._id },
    { initial: loaderData }
  );

  if (!house) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            House not found
          </h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to houses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to houses
        </Link>
      </div>

      {/* House Details */}
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 border-b border-gray-200 pb-6">
          <h1
            className="mb-2 text-4xl font-bold text-gray-900"
            data-sanity={encodeDataAttribute(['title'])}
          >
            {house.title || 'Untitled House'}
          </h1>
          {house.address && (
            <p
              className="text-lg text-gray-600"
              data-sanity={encodeDataAttribute(['address'])}
            >
              {house.address}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Basic Information */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
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
                <span className="text-gray-700">
                  <span
                    className="font-medium"
                    data-sanity={encodeDataAttribute(['bedrooms'])}
                  >
                    {house.bedrooms || 0}
                  </span>{' '}
                  bedrooms
                </span>
              </div>

              {house.address && (
                <div className="flex items-start">
                  <svg
                    className="mt-0.5 mr-3 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span
                    className="text-gray-700"
                    data-sanity={encodeDataAttribute(['address'])}
                  >
                    {house.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Placeholder */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Additional Info
            </h2>
            <div className="rounded-lg bg-gray-50 p-6">
              <p className="text-center text-gray-600">
                More details about this house can be added to the Sanity schema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
