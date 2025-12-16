import { buildLegacyTheme } from 'sanity';

/**
 * Studio branding is intentionally centralized here.
 * Tweak these values to match client branding.
 */
const brand = {
  name: 'ART',
  primary: '#2563eb',
  black: '#111827',
  white: '#ffffff',
};

export function StudioLogo() {
  return (
    <div style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
      {brand.name}
    </div>
  );
}

export const studioTheme = buildLegacyTheme({
  '--black': brand.black,
  '--white': brand.white,
  '--gray': '#6b7280',
  '--gray-base': '#6b7280',
  '--component-bg': brand.white,
  '--component-text-color': brand.black,
  '--brand-primary': brand.primary,
  '--default-button-color': '#6b7280',
  '--default-button-primary-color': brand.primary,
  '--default-button-success-color': '#16a34a',
  '--default-button-warning-color': '#ca8a04',
  '--default-button-danger-color': '#dc2626',
  '--state-info-color': brand.primary,
  '--state-success-color': '#16a34a',
  '--state-warning-color': '#ca8a04',
  '--state-danger-color': '#dc2626',
  '--main-navigation-color': brand.black,
  '--main-navigation-color--inverted': brand.white,
  '--focus-color': brand.primary,
});
