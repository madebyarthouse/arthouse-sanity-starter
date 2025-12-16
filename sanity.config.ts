import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './app/sanity/schema/index';
import { structure } from './app/sanity/structure';
import { projectId, dataset, apiVersion } from './app/sanity/project-details';

// Helper to get preview origin in both browser and Node.js environments
const getPreviewOrigin = () => {
  // In browser (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN;
  }
  // In Node.js (Sanity CLI)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN;
  }
  return undefined;
};

export default defineConfig({
  projectId: projectId!,
  dataset: dataset!,
  apiVersion,
  name: 'default',
  title: 'arthouse-sanity-starter',
  basePath: '/studio',
  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: getPreviewOrigin() || 'http://localhost:5173',
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
});
