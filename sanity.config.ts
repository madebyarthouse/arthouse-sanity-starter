import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'arthouse-sanity-starter',
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: import.meta.env.SANITY_STUDIO_DATASET || process.env.SANITY_STUDIO_DATASET!,
  apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || process.env.SANITY_STUDIO_API_VERSION || '2024-02-13',

  plugins: [
    structureTool(), 
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:5174',
        preview: "/",
        previewMode: {
          enable: "/api/preview-mode/enable",
          disable: "/api/preview-mode/disable",
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
        path: './app/types/sanity.ts',
        schema: './schemaTypes/index.ts',
        queries: ['./app/**/*.{ts,tsx}']
      }
    ]
  }
})
