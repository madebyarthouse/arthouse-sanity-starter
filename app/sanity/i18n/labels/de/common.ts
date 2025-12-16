import type { CommonLabels, ValidationLabels } from '../schema';

export const common: CommonLabels = {
  untitled: 'Ohne Titel',
  noAddress: 'Keine Adresse',
};

export const validation: ValidationLabels = {
  required: 'Dieses Feld ist erforderlich',
  minLength: (min) => `Mindestens ${min} Zeichen erforderlich`,
  maxLength: (max) => `Maximal ${max} Zeichen erlaubt`,
};
