import type { SITE_SETTINGS_QUERYResult } from '../../sanity.types';

interface SiteSettingsDebugProps {
  siteSettings: SITE_SETTINGS_QUERYResult | null;
}

export function SiteSettingsDebug({ siteSettings }: SiteSettingsDebugProps) {
  if (!siteSettings) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-4">
      <div className="container mx-auto">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">
          Global Settings
        </h2>
        <div className="grid grid-cols-1 gap-4 text-xs text-gray-600 md:grid-cols-3">
          <div>
            <strong>Site Title:</strong>{' '}
            {siteSettings.metaSettings?.siteTitle || 'N/A'}
          </div>
          <div>
            <strong>Analytics:</strong>{' '}
            {siteSettings.analytics?.enabled ? 'Enabled' : 'Disabled'} (
            {siteSettings.analytics?.provider || 'N/A'})
          </div>
          <div>
            <strong>Socials:</strong> {siteSettings.socials?.length || 0}{' '}
            configured
          </div>
        </div>
      </div>
    </div>
  );
}
