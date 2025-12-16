import type { StudioLabels } from '../schema';
import { documents } from './documents';
import { objects } from './objects';
import { common, validation } from './common';

const structure = {
  homepage: 'Homepage',
  allPages: 'All Pages',
  imprint: 'Imprint',
  privacy: 'Privacy Policy',
  settings: 'Settings',
};

export const en: StudioLabels = {
  documents,
  objects,
  structure,
  common,
  validation,
};
