// Environment variables for Plausible configuration
const productionDomain = process.env.PLAUSIBLE_DOMAIN || "your-domain.com"; // Change this to your actual domain
const productionUrl = process.env.PRODUCTION_URL || `https://${productionDomain}`;

type Config = {
  productionDomain: string;
  productionUrl: string;
  themeColor: string;
};

export const config: Config = {
  productionDomain,
  productionUrl,
  themeColor: "#000", // Your brand color
};
