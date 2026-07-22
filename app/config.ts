import { getProductionOrigin } from '@/deployment';

// Server-side configuration - only use on the server
export function getServerConfig() {
  const productionUrl = getProductionOrigin() ?? '';
  const siteUrl = productionUrl;
  const siteHost = siteUrl ? new URL(siteUrl).hostname : '';

  return {
    siteUrl,
    siteHost,
    productionUrl,
  };
}

// Client-side configuration type
export type Config = {
  siteUrl: string;
  siteHost: string;
  productionUrl: string;
};

// Default client config (used as fallback)
export const defaultConfig: Config = {
  siteUrl: '',
  siteHost: '',
  productionUrl: '',
};
