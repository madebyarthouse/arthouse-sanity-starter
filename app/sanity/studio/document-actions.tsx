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

type VisibilityActionConfig = {
  label: string;
  icon: typeof EyeOpenIcon;
};

type ResolveHrefDocument = {
  _id: string;
  _type: string;
  slug?: { current?: string | null } | null;
};

const visibilityActionMap: Record<VisibilityValue, VisibilityActionConfig> = {
  public: { label: 'Public', icon: EyeOpenIcon },
  hidden: { label: 'Hidden', icon: EyeClosedIcon },
  private: { label: 'Private', icon: LockIcon },
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isVisibilityValue(value: unknown): value is VisibilityValue {
  return value === 'public' || value === 'hidden' || value === 'private';
}

function getSlugValue(document: unknown): string | null {
  if (!isObjectRecord(document)) {
    return null;
  }

  const slug = document.slug;
  if (!isObjectRecord(slug)) {
    return null;
  }

  const current = slug.current;
  if (typeof current !== 'string') {
    return null;
  }

  return current;
}

function getSlugForResolveHref(
  document: Record<string, unknown>
): ResolveHrefDocument['slug'] {
  const slug = document.slug;
  if (slug === null || slug === undefined) {
    return slug;
  }
  if (!isObjectRecord(slug)) {
    return undefined;
  }

  const current = slug.current;
  if (
    current !== undefined &&
    current !== null &&
    typeof current !== 'string'
  ) {
    return undefined;
  }

  return { current };
}

function getResolveHrefDocument(document: unknown): ResolveHrefDocument | null {
  if (!isObjectRecord(document)) {
    return null;
  }

  const id = document._id;
  const type = document._type;
  if (typeof id !== 'string' || typeof type !== 'string') {
    return null;
  }

  return {
    _id: id,
    _type: type,
    slug: getSlugForResolveHref(document),
  };
}

function getCurrentVisibility(
  draft: DocumentActionProps['draft'],
  published: DocumentActionProps['published']
): VisibilityValue | null {
  const document = draft ?? published;
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

    const { label, icon } = visibilityActionMap[targetVisibility];

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
    const document = props.draft ?? props.published;
    const slug = getSlugValue(document);
    const url = slug ? `${baseUrl}/${slug}` : `${baseUrl}/`;

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
  const document = props.draft ?? props.published;
  const resolveDoc = getResolveHrefDocument(document);

  if (!resolveDoc) {
    return null;
  }

  const href = resolveHref(resolveDoc);
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
