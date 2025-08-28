const defaultApiVersion = '2024-02-13';

// Helper function to get environment variables across different contexts
function getEnvVar(key: keyof ImportMetaEnv): string | undefined {
  // Server-side (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }

  // Client-side with Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }

  // Client-side with window.ENV (for server-side rendering)
  if (typeof window !== 'undefined' && (window as any).ENV) {
    return (window as any).ENV[key];
  }

  return undefined;
}

// Get environment variables
const projectId = getEnvVar('VITE_SANITY_PROJECT_ID');
const dataset = getEnvVar('VITE_SANITY_DATASET');
const apiVersion = getEnvVar('VITE_SANITY_API_VERSION') ?? defaultApiVersion;
const studioUrl = getEnvVar('VITE_SANITY_STUDIO_URL');

// Validate required environment variables
if (!projectId) {
  throw new Error(
    'Missing VITE_SANITY_PROJECT_ID in .env, run npx sanity@latest init --env'
  );
}
if (!dataset) {
  throw new Error(
    'Missing VITE_SANITY_DATASET in .env, run npx sanity@latest init --env'
  );
}

export { apiVersion, dataset, projectId, studioUrl };
