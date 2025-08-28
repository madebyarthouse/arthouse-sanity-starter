// Server-side configuration - only use on the server
export function getServerConfig() {
  return {
    productionDomain: process.env.PLAUSIBLE_DOMAIN || "your-domain.com", // Change this to your actual domain
    productionUrl: process.env.PRODUCTION_URL || `https://${process.env.PLAUSIBLE_DOMAIN || "your-domain.com"}`,
    themeColor: "#000", // Your brand color
  };
}

// Client-side configuration type
export type Config = {
  productionDomain: string;
  productionUrl: string;
  themeColor: string;
};

// Default client config (used as fallback)
export const defaultConfig: Config = {
  productionDomain: "your-domain.com",
  productionUrl: "https://your-domain.com",
  themeColor: "#000",
};
