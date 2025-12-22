const defaultApiVersion = '2024-02-13';

function getEnvVar(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) return process.env[key];
  if (typeof window !== 'undefined' && (window as any).ENV)
    return (window as any).ENV[key];
  return undefined;
}

// Get environment variables
const projectId = getEnvVar('VITE_SANITY_PROJECT_ID');
const dataset = getEnvVar('VITE_SANITY_DATASET');
const apiVersion = getEnvVar('VITE_SANITY_API_VERSION') ?? defaultApiVersion;
const studioUrl =
  getEnvVar('VITE_SANITY_STUDIO_URL') ??
  // Sensible dev default for `sanity dev` (default port + basePath in `sanity.config.ts`)
  (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
    ? 'http://localhost:5173/studio'
    : undefined);

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
