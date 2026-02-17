export type DeploymentTarget = 'custom' | 'vercel' | 'cloudflare';

type GetRequestBaseOriginParams = {
  requestUrl: string;
};

export type DeploymentConfig = {
  target: DeploymentTarget;
  localOrigin: string;
  previewOrigin: string;
  productionOrigin: string | undefined;
  providerPreviewOrigin: string | undefined;
  providerProductionOrigin: string | undefined;
};

const DEFAULT_LOCAL_ORIGIN = 'http://localhost:5173';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

function readEnvValue(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  return trimmed;
}

function ensureProtocol(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;

  const hostname = value.split('/')[0]?.split(':')[0]?.toLowerCase();
  if (!hostname) return value;

  if (LOCAL_HOSTNAMES.has(hostname)) {
    return `http://${value}`;
  }

  return `https://${value}`;
}

function normalizeOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const withProtocol = ensureProtocol(value.trim());

  try {
    const url = new URL(withProtocol);
    return `${url.protocol}//${url.host}`;
  } catch {
    return undefined;
  }
}

function getDeploymentTarget(): DeploymentTarget {
  const value = readEnvValue('DEPLOYMENT_TARGET')?.toLowerCase();

  if (value === 'vercel') return 'vercel';
  if (value === 'cloudflare') return 'cloudflare';

  return 'custom';
}

function getVercelOrigin(): string | undefined {
  return normalizeOrigin(readEnvValue('VERCEL_URL'));
}

function getProviderPreviewOrigin(target: DeploymentTarget): string | undefined {
  if (target === 'vercel') {
    const vercelEnvironment = readEnvValue('VERCEL_ENV')?.toLowerCase();
    if (vercelEnvironment === 'production') return undefined;
    return getVercelOrigin();
  }

  if (target === 'cloudflare') {
    return normalizeOrigin(readEnvValue('CF_PAGES_URL'));
  }

  return undefined;
}

function getProviderProductionOrigin(
  target: DeploymentTarget
): string | undefined {
  if (target !== 'vercel') return undefined;

  const vercelEnvironment = readEnvValue('VERCEL_ENV')?.toLowerCase();
  if (vercelEnvironment !== 'production') return undefined;

  return getVercelOrigin();
}

export function getDeploymentConfig(): DeploymentConfig {
  const target = getDeploymentTarget();

  const localOrigin =
    normalizeOrigin(readEnvValue('DEPLOYMENT_LOCAL_ORIGIN')) ??
    DEFAULT_LOCAL_ORIGIN;

  const explicitProductionOrigin = normalizeOrigin(
    readEnvValue('DEPLOYMENT_PRODUCTION_ORIGIN')
  );
  const explicitPreviewOrigin = normalizeOrigin(
    readEnvValue('DEPLOYMENT_PREVIEW_ORIGIN')
  );

  const providerPreviewOrigin = getProviderPreviewOrigin(target);
  const providerProductionOrigin = getProviderProductionOrigin(target);

  const productionOrigin = explicitProductionOrigin ?? providerProductionOrigin;
  const previewOrigin =
    explicitPreviewOrigin ??
    providerPreviewOrigin ??
    productionOrigin ??
    localOrigin;

  return {
    target,
    localOrigin,
    previewOrigin,
    productionOrigin,
    providerPreviewOrigin,
    providerProductionOrigin,
  };
}

export function getPreviewOrigin(): string {
  return getDeploymentConfig().previewOrigin;
}

export function getProductionOrigin(): string | undefined {
  return getDeploymentConfig().productionOrigin;
}

export function getRequestBaseOrigin({
  requestUrl,
}: GetRequestBaseOriginParams): string {
  const productionOrigin = getProductionOrigin();
  if (productionOrigin) return productionOrigin;

  return new URL(requestUrl).origin;
}

export function getPresentationAllowOrigins(): string[] {
  const { localOrigin, previewOrigin, productionOrigin } = getDeploymentConfig();

  const origins = ['http://localhost:*', localOrigin, previewOrigin, productionOrigin]
    .filter((origin): origin is string => Boolean(origin));

  return Array.from(new Set(origins));
}
