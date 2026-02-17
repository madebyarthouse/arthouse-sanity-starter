import type { DocumentBadgeComponent } from 'sanity';
import { EyeOpenIcon, EyeClosedIcon, LockIcon } from '@sanity/icons';

type DocumentBadgeProps = Parameters<DocumentBadgeComponent>[0];

type VisibilityValue = 'public' | 'hidden' | 'private';

function getVisibility(
  draft: DocumentBadgeProps['draft'],
  published: DocumentBadgeProps['published']
): VisibilityValue | null {
  const doc = draft || published;
  const visibility = (doc as { meta?: { visibility?: string } })?.meta
    ?.visibility;
  if (
    visibility === 'public' ||
    visibility === 'hidden' ||
    visibility === 'private'
  ) {
    return visibility;
  }
  return null;
}

export const VisibilityBadge: DocumentBadgeComponent = function VisibilityBadge(
  props
) {
  const visibility = getVisibility(props.draft, props.published);

  if (!visibility) {
    return null;
  }

  const badgeMap = {
    public: { label: 'Public', color: 'success' as const, icon: EyeOpenIcon },
    hidden: { label: 'Hidden', color: 'warning' as const, icon: EyeClosedIcon },
    private: { label: 'Private', color: 'danger' as const, icon: LockIcon },
  };

  const badge = badgeMap[visibility];

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

  if (isPublished && hasDraft) {
    return {
      label: 'Draft',
      title: 'Has unsaved changes',
      color: 'warning',
    };
  }

  if (isPublished) {
    return {
      label: 'Save',
      title: 'Published',
      color: 'success',
    };
  }

  return {
    label: 'Draft',
    title: 'Not published',
  };
};
