import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'arthouse-sanity-starter',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || process.env.SANITY_API_VERSION || '2024-02-13',


  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
