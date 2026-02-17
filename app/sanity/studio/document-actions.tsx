import { useDocumentOperation } from 'sanity';
import type { DocumentActionComponent } from 'sanity';
import {
  EyeOpenIcon,
  EyeClosedIcon,
  LockIcon,
  LaunchIcon,
} from '@sanity/icons';
import { getPreviewOrigin } from '@/deployment';
import { resolveHref } from '@/components/features/sanity/helpers/resolve-href';

type VisibilityValue = 'public' | 'hidden' | 'private';

type DocumentActionProps = Parameters<DocumentActionComponent>[0];

function getCurrentVisibility(
  draft: DocumentActionProps['draft'],
  published: DocumentActionProps['published']
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

function createSetVisibilityAction(
  targetVisibility: VisibilityValue
): DocumentActionComponent {
  return function SetVisibilityAction(props) {
    const { patch } = useDocumentOperation(props.id, props.type);
    const currentVisibility = getCurrentVisibility(
      props.draft,
      props.published
    );

    if (currentVisibility === targetVisibility) {
      return null;
    }

    const labelMap = {
      public: { label: 'Public', icon: EyeOpenIcon },
      hidden: { label: 'Hidden', icon: EyeClosedIcon },
      private: { label: 'Private', icon: LockIcon },
    } as const;

    const { label, icon } = labelMap[targetVisibility];

    return {
      label,
      icon,
      onHandle: () => {
        patch.execute([
          {
            setIfMissing: {
              meta: {},
            },
          },
          {
            set: {
              'meta.visibility': targetVisibility,
            },
          },
        ]);
        props.onComplete();
      },
    };
  };
}

export const SetVisibilityPublicAction = createSetVisibilityAction('public');
export const SetVisibilityHiddenAction = createSetVisibilityAction('hidden');
export const SetVisibilityPrivateAction = createSetVisibilityAction('private');

export const OpenLivePageAction: DocumentActionComponent =
  function OpenLivePageAction(props) {
    const baseUrl = getPreviewOrigin();
    const doc = props.draft || props.published;
    let url = `${baseUrl}/`;

    if (doc && typeof doc === 'object' && 'slug' in doc) {
      const slug = doc.slug as { current?: string | null } | null | undefined;
      if (slug?.current) {
        url = `${baseUrl}/${slug.current}`;
      }
    }

    return {
      label: 'Open live page',
      icon: LaunchIcon,
      onHandle: () => {
        window.open(url, '_blank', 'noopener,noreferrer');
        props.onComplete();
      },
    };
  };

export const OpenPageAction: DocumentActionComponent = function OpenPageAction(
  props
) {
  const baseUrl = getPreviewOrigin();
  const doc = props.draft || props.published;

  if (!doc) {
    return null;
  }

  const href = resolveHref({
    _id: doc._id,
    _type: doc._type,
    slug: doc.slug as { current?: string | null } | null | undefined,
  });

  if (!href) {
    return null;
  }

  const url = `${baseUrl}${href}`;

  return {
    label: 'Open live page',
    icon: LaunchIcon,
    onHandle: () => {
      window.open(url, '_blank', 'noopener,noreferrer');
      props.onComplete();
    },
  };
};

export function createSaveAction(
  originalAction: DocumentActionComponent
): DocumentActionComponent {
  return function SaveAction(props) {
    const originalResult = originalAction(props);
    if (!originalResult) {
      return null;
    }

    return {
      ...originalResult,
      label: 'Save',
    };
  };
}
