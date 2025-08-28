import { createClient } from '@sanity/client';
import {
  projectId,
  dataset,
  apiVersion,
  studioUrl,
} from '~/sanity/project-details';

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: true,
  stega: {
    studioUrl: studioUrl,
  },
});
