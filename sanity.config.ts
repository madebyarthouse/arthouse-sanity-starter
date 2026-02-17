import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './app/sanity/schema/index';
import { structure } from './app/sanity/structure';
import { projectId, dataset, apiVersion } from './app/sanity/project-details';
import { locations, mainDocuments } from './app/sanity/presentation/resolve';
import { StudioLogo, studioTheme } from './app/sanity/studio/branding';
import {
  SetVisibilityPublicAction,
  SetVisibilityHiddenAction,
  SetVisibilityPrivateAction,
  OpenLivePageAction,
  OpenPageAction,
  createSaveAction,
} from './app/sanity/studio/document-actions';
import {
  SaveDraftBadge,
  VisibilityBadge,
} from './app/sanity/studio/document-badges';

function getPreviewOrigin(): string | undefined {
  // Sanity CLI / Node
  if (typeof process !== 'undefined' && process.env) {
    return (
      process.env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN ??
      process.env.SANITY_STUDIO_PREVIEW_ORIGIN ??
      undefined
    );
  }

  // Embedded Studio (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const env = import.meta.env as unknown as {
      VITE_SANITY_STUDIO_PREVIEW_ORIGIN?: string;
    };
    return env.VITE_SANITY_STUDIO_PREVIEW_ORIGIN ?? undefined;
  }

  return undefined;
}

export default defineConfig({
  projectId: projectId!,
  dataset: dataset!,
  apiVersion,
  name: 'default',
  title: 'arthouse-sanity-starter',
  icon: StudioLogo,
  theme: studioTheme,
  basePath: '/studio',
  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      allowOrigins: ['http://localhost:*'],
      resolve: { locations, mainDocuments },
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

  document: {
    actions: (prev, context) => {
      const { schemaType } = context;

      if (schemaType === 'page') {
        return prev
          .map((action) => {
            if (action.action === 'publish') {
              return createSaveAction(action);
            }
            return action;
          })
          .concat([
            OpenPageAction,
            SetVisibilityPublicAction,
            SetVisibilityHiddenAction,
            SetVisibilityPrivateAction,
          ]);
      }

      return [...prev, OpenLivePageAction];
    },
    badges: (prev, context) => {
      const { schemaType } = context;

      if (schemaType === 'page') {
        return [SaveDraftBadge, VisibilityBadge];
      }

      return [SaveDraftBadge];
    },
  },
});
