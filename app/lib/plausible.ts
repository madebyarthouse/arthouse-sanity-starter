import { getServerConfig } from '../config';

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
  // DISABLED FOR TESTING - Just log the event instead of sending to Plausible
  const config = getServerConfig();
  const body = JSON.stringify({
    name: event,
    url,
    domain: config.productionDomain,
    props: {
      ...props,
    },
  });

  console.log('Plausible analytics disabled - would have tracked event:', body);

  // Return a mock successful response
  return new Response('OK', { status: 200 });

  /* ORIGINAL PLAUSIBLE CODE - COMMENTED OUT FOR TESTING
  return await fetch("https://plausible.io/api/event", {
    body,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": userAgent,
      "X-Forwarded-For": ip,
    },
  });
  */
};

// Client-side event tracking helper
export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  // DISABLED FOR TESTING - Just log the event instead of tracking
  console.log(
    'Plausible analytics disabled - would have tracked client event:',
    eventName,
    props
  );

  /* ORIGINAL PLAUSIBLE CODE - COMMENTED OUT FOR TESTING
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props });
  }
  */
};
