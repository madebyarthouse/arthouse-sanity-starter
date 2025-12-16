import type { StudioLabels } from '../schema';
import { documents } from './documents';
import { objects } from './objects';
import { common, validation } from './common';

const structure = {
  homepage: 'Homepage',
  allPages: 'Alle Seiten',
  imprint: 'Impressum',
  privacy: 'Datenschutz',
  settings: 'Einstellungen',
};

export const de: StudioLabels = {
  documents,
  objects,
  structure,
  common,
  validation,
};
