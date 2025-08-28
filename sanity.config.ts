import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './app/sanity/schema';
import { projectId, dataset, apiVersion } from './app/sanity/project-details';

export default defineConfig({
  projectId: projectId!,
  dataset: dataset!,
  apiVersion,
  name: 'default',
  title: 'arthouse-sanity-starter',
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin:
          import.meta.env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN ||
          'http://localhost:5173',
        preview: '/',
        previewMode: {
          enable: '/api/preview-mode/enable',
          disable: '/api/preview-mode/disable',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  typegen: {
    // Look for GROQ queries in the app directory
    targets: [
      {
        name: 'types',
        path: './app/sanity/types.ts',
        schema: './app/sanity/schema.ts',
        queries: ['./app/**/*.{ts,tsx}'],
      },
    ],
  },
});
