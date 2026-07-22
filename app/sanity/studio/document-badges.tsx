import type { DocumentBadgeComponent } from 'sanity';
import { EyeOpenIcon, EyeClosedIcon, LockIcon } from '@sanity/icons';

type DocumentBadgeProps = Parameters<DocumentBadgeComponent>[0];

type VisibilityValue = 'public' | 'hidden' | 'private';

type VisibilityBadgeConfig = {
  label: string;
  color: 'success' | 'warning' | 'danger';
  icon: typeof EyeOpenIcon;
};

const visibilityBadgeMap: Record<VisibilityValue, VisibilityBadgeConfig> = {
  public: { label: 'Public', color: 'success', icon: EyeOpenIcon },
  hidden: { label: 'Hidden', color: 'warning', icon: EyeClosedIcon },
  private: { label: 'Private', color: 'danger', icon: LockIcon },
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isVisibilityValue(value: unknown): value is VisibilityValue {
  return value === 'public' || value === 'hidden' || value === 'private';
}

function extractVisibilityFromDocument(
  document: unknown
): VisibilityValue | null {
  if (!isObjectRecord(document)) {
    return null;
  }

  const meta = document.meta;
  if (!isObjectRecord(meta)) {
    return null;
  }

  const visibility = meta.visibility;
  if (!isVisibilityValue(visibility)) {
    return null;
  }

  return visibility;
}

function getVisibility(
  draft: DocumentBadgeProps['draft'],
  published: DocumentBadgeProps['published']
): VisibilityValue | null {
  return extractVisibilityFromDocument(draft ?? published);
}

export const VisibilityBadge: DocumentBadgeComponent = function VisibilityBadge(
  props
) {
  const visibility = getVisibility(props.draft, props.published);

  if (!visibility) {
    return null;
  }

  const badge = visibilityBadgeMap[visibility];

  return {
    label: badge.label,
    title: `Visibility: ${badge.label}`,
    color: badge.color,
    icon: badge.icon,
  };
};

export const SaveDraftBadge: DocumentBadgeComponent = function SaveDraftBadge(
  props
) {
  const isPublished = !!props.published;
  const hasDraft = !!props.draft;

  if (!isPublished) {
    return {
      label: 'Draft',
      title: 'Not published',
    };
  }

  if (hasDraft) {
    return {
      label: 'Draft',
      title: 'Has unsaved changes',
      color: 'warning',
    };
  }

  return {
    label: 'Save',
    title: 'Published',
    color: 'success',
  };
};
