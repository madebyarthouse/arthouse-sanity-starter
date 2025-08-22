import { config } from "../config";

export const trackPlausibleEvent = async ({
  event,
  url,
  ip,
  props = {},
  userAgent,
}: {
  event: string;
  url: string;
  ip: string;
  props?: Record<string, any>;
  userAgent: string;
}) => {
  const body = JSON.stringify({
    name: event,
    url,
    domain: config.productionDomain,
    props: {
      ...props,
    },
  });

  console.log("Tracking event", body);

  return await fetch("https://plausible.io/api/event", {
    body,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": userAgent,
      "X-Forwarded-For": ip,
    },
  });
};

// Client-side event tracking helper
export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props });
  }
};
