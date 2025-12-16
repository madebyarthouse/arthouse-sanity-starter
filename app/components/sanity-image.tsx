import type { SanityImageSource } from '@sanity/image-url';
import { urlFor, generateSrcSet } from '../lib/sanity-image';
import { useState } from 'react';

interface SanityImageProps {
  image: SanityImageSource;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  widths?: number[];
  showBlurPlaceholder?: boolean;
}

export function SanityImage({
  image,
  alt = '',
  width = 800,
  height,
  sizes = '100vw',
  className = '',
  priority = false,
  widths,
  showBlurPlaceholder = false,
}: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'sanity-image.tsx:29',
      message: 'SanityImage component entry',
      data: {
        hasImage: !!image,
        imageType: typeof image,
        imageKeys:
          image && typeof image === 'object' ? Object.keys(image) : null,
        imageStructure: JSON.stringify(image),
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'B,D,E',
    }),
  }).catch(() => {});
  // #endregion

  if (!image) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'sanity-image.tsx:35',
        message: 'Image null - early return',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion
    return null;
  }

  // Check if image has a valid asset reference
  const hasValidAsset =
    typeof image === 'object' &&
    'asset' in image &&
    image.asset !== null &&
    typeof image.asset === 'object' &&
    ('_ref' in image.asset || '_id' in image.asset);

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'sanity-image.tsx:51',
      message: 'Asset validation result',
      data: {
        hasValidAsset,
        hasAsset: 'asset' in (image || {}),
        assetNull: image && 'asset' in image ? image.asset === null : null,
        assetType: image && 'asset' in image ? typeof image.asset : null,
        hasRef:
          image &&
          'asset' in image &&
          image.asset &&
          typeof image.asset === 'object'
            ? '_ref' in image.asset
            : null,
        hasId:
          image &&
          'asset' in image &&
          image.asset &&
          typeof image.asset === 'object'
            ? '_id' in image.asset
            : null,
        assetKeys:
          image &&
          'asset' in image &&
          image.asset &&
          typeof image.asset === 'object'
            ? Object.keys(image.asset)
            : null,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'pre-fix',
      hypothesisId: 'B,D',
    }),
  }).catch(() => {});
  // #endregion

  if (!hasValidAsset) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/378cb7be-f32c-4b06-9644-920756e4aab0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'sanity-image.tsx:59',
        message: 'Invalid asset - returning null',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion
    return null;
  }

  const srcSet = generateSrcSet(image, widths);
  const src = urlFor(image).width(width).auto('format').url();

  const lqip =
    showBlurPlaceholder && typeof image === 'object' && 'asset' in image
      ? (image.asset as any)?.metadata?.lqip
      : null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {lqip && !isLoaded && (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-sm"
        />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={`${lqip ? 'relative' : ''} h-full w-full object-cover transition-opacity duration-300 ${
          isLoaded || !lqip ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
