import { studioLocale } from '../config';
import type { StudioLabels } from './schema';
import { en } from './en';
import { de } from './de';

const locales: Record<string, StudioLabels> = {
  en,
  de,
};

/**
 * The active labels based on the configured studio locale.
 * Change `studioLocale` in `app/sanity/i18n/config.ts` to switch languages.
 */
export const labels: StudioLabels = locales[studioLocale] ?? en;

// Re-export for convenience
export type {
  StudioLabels,
  DocumentLabels,
  ObjectLabels,
  CommonLabels,
  ValidationLabels,
} from './schema';
export { en } from './en';
export { de } from './de';
