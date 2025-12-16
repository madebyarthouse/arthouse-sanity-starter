import { createClient } from '@sanity/client';
import {
  projectId,
  dataset,
  apiVersion,
  studioUrl,
} from '@/sanity/project-details';

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: true,
  // Only enable stega when we have a valid Studio URL.
  // (If stega is enabled without `studioUrl`, @sanity/client will throw once a CSM is present.)
  stega: studioUrl ? { enabled: true, studioUrl } : false,
});
