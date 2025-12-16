import groq, { defineQuery } from 'groq';

export const ANALYTICS_QUERY = defineQuery(groq`
  *[_type == "siteSettings"][0]{
    analytics{
      enabled,
      provider,
      domain
    }
  }
`);
