import { createContext, useContext } from 'react';
import type { SITE_SETTINGS_QUERYResult } from '@gen/sanity';

type SiteSettingsValue = SITE_SETTINGS_QUERYResult | null | undefined;
type EncodeDataAttribute = (path: Array<string | number>) => string | undefined;

const SiteSettingsContext = createContext<SiteSettingsValue>(undefined);
const SiteSettingsDataAttributeContext =
  createContext<EncodeDataAttribute | null>(null);

export function SiteSettingsProvider({
  value,
  encodeDataAttribute,
  children,
}: {
  value: SiteSettingsValue;
  encodeDataAttribute?: EncodeDataAttribute;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      <SiteSettingsDataAttributeContext.Provider
        value={encodeDataAttribute ?? null}
      >
        {children}
      </SiteSettingsDataAttributeContext.Provider>
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function useSiteSettingsDataAttribute() {
  return useContext(SiteSettingsDataAttributeContext);
}
