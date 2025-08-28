/// <reference types="vite/client" />

interface ViteTypeOptions {
    // By adding this line, you can make the type of ImportMetaEnv strict
    // to disallow unknown keys.
    // strictImportMetaEnv: unknown
  }
  
  interface ImportMetaEnv {
    readonly SANITY_STUDIO_PROJECT_ID: string
    readonly SANITY_STUDIO_DATASET: string
    readonly SANITY_STUDIO_API_VERSION: string
    readonly SANITY_STUDIO_PREVIEW_ORIGIN: string
    readonly SANITY_STUDIO_PREVIEW_URL: string
    readonly SANITY_STUDIO_PREVIEW_SECRET: string
    readonly SANITY_STUDIO_PREVIEW_TOKEN: string
    readonly SANITY_STUDIO_PREVIEW_SECRET: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }