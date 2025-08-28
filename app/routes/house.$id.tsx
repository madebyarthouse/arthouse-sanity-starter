import type { Route } from "./+types/house.$id";
import type { SanityDocument } from "@sanity/client";
import { useQuery } from "@sanity/react-loader";
import { Link } from "react-router";
import { loadQuery } from "../sanity/loader.server";
import { previewContext } from "../sanity/preview";

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
    throw new Response("House not found", { status: 404 });
  }
  
  return data;
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptor[] {
  const house = loaderData?.data;
  return [
    { title: house?.title ? `${house.title} - Arthouse` : "House - Arthouse" },
    { name: "description", content: house?.address || "House details" },
  ];
}

export default function HouseDetail({ loaderData }: Route.ComponentProps) {
  const { data: house, encodeDataAttribute } = useQuery(query, { id: loaderData.data._id }, { initial: loaderData });

  if (!house) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">House not found</h1>
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
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg 
            className="w-4 h-4 mr-2" 
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
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 
            className="text-4xl font-bold text-gray-900 mb-2"
            data-sanity={encodeDataAttribute(["title"])}
          >
            {house.title || "Untitled House"}
          </h1>
          {house.address && (
            <p 
              className="text-lg text-gray-600"
              data-sanity={encodeDataAttribute(["address"])}
            >
              {house.address}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg 
                  className="w-5 h-5 mr-3 text-gray-400" 
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
                    data-sanity={encodeDataAttribute(["bedrooms"])}
                  >
                    {house.bedrooms || 0}
                  </span> bedrooms
                </span>
              </div>

              {house.address && (
                <div className="flex items-start">
                  <svg 
                    className="w-5 h-5 mr-3 mt-0.5 text-gray-400" 
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
                    data-sanity={encodeDataAttribute(["address"])}
                  >
                    {house.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Placeholder */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Info</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 text-center">
                More details about this house can be added to the Sanity schema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
