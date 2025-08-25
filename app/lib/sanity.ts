import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || process.env.SANITY_STUDIO_API_VERSION || '2024-02-13',
  useCdn: process.env.NODE_ENV === 'production', // Use CDN for production, fresh data for development
});
