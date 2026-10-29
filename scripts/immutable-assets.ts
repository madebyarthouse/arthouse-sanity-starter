import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { Plugin, Rollup } from 'vite';

type OutputBundle = Rollup.OutputBundle;
type NormalizedOutputOptions = Rollup.NormalizedOutputOptions;

const directory = 'assets/immutable';
const cacheControl = '  Cache-Control: public, max-age=31536000, immutable';

/** Only bundler-emitted hashed JS/CSS qualify; public files never enter this list. */
export function assetHeaders(
  bundle: OutputBundle,
  options: NormalizedOutputOptions,
  existing = '',
  reservedDirectory = false
) {
  const files = Object.values(bundle)
    .filter((entry) => {
      if (/\bmanifest[-.]/i.test(path.posix.basename(entry.fileName)))
        return false;
      const extension = path.posix.extname(entry.fileName);
      if (entry.type === 'chunk' ? extension !== '.js' : extension !== '.css')
        return false;
      let template: string;
      if (entry.type === 'asset') {
        const naming = options.assetFileNames;
        template = typeof naming === 'function' ? naming(entry) : naming;
      } else {
        const naming = entry.isEntry
          ? options.entryFileNames
          : options.chunkFileNames;
        template = typeof naming === 'function' ? naming(entry) : naming;
      }
      return (
        /\[hash(?::\d+)?\]/.test(template) &&
        /-[A-Za-z0-9_-]{8,}\.(js|css)$/.test(entry.fileName)
      );
    })
    .map((entry) => entry.fileName)
    .sort();
  if (!files.length) throw new Error('No emitted hashed client JS/CSS found');
  if (
    reservedDirectory &&
    files.some((file) => !file.startsWith(`${directory}/`))
  ) {
    throw new Error('Client JS/CSS escaped the reserved immutable directory');
  }
  // Conflicting rules are joined by Cloudflare rather than overriding one another.
  // These applications currently have no source Cache-Control rules; fail closed
  // if that changes, so a future policy is reconciled deliberately.
  if (/^\s+(?:!\s*)?Cache-Control\b/im.test(existing)) {
    throw new Error(
      'Reconcile existing Cache-Control rules before generating asset headers'
    );
  }
  const paths = reservedDirectory ? [`${directory}/*`] : files;
  const rules = existing
    .split('\n')
    .filter((line) => /^\S/.test(line) && !line.startsWith('#'));
  if (rules.length + paths.length > 100) {
    throw new Error(
      'Cloudflare supports at most 100 header rules; use the reserved client directory'
    );
  }
  const source =
    `${existing.trimEnd()}\n\n# Generated from emitted, content-hashed client JS/CSS only.\n${paths.map((file) => `/${file}\n${cacheControl}\n`).join('\n')}`.trimStart();
  return { files, source };
}

/** Preserve asset-first routing: a missing asset must reach the app without these headers. */
export function immutableAssets({ reservedDirectory = false } = {}): Plugin {
  let publicDir: string | false;
  let root = '';
  let outputDir = '';
  let emitted = new Set<string>();
  return {
    name: 'immutable-client-assets',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      publicDir = config.publicDir;
      root = config.root;
    },
    outputOptions(options) {
      if (this.environment.name !== 'client' || !reservedDirectory) return;
      const assetFileNames = options.assetFileNames;
      return {
        ...options,
        entryFileNames: `${directory}/[name]-[hash].js`,
        chunkFileNames: `${directory}/[name]-[hash].js`,
        assetFileNames(asset) {
          return asset.names.some((name) => name.endsWith('.css'))
            ? `${directory}/[name]-[hash][extname]`
            : typeof assetFileNames === 'function'
              ? assetFileNames(asset)
              : (assetFileNames ?? 'assets/[name]-[hash][extname]');
        },
      };
    },
    generateBundle(options, bundle) {
      if (this.environment.name !== 'client') return;
      outputDir = path.resolve(root, this.environment.config.build.outDir);
      let existing = '';
      if (publicDir) {
        try {
          existing = readFileSync(path.join(publicDir, '_headers'), 'utf8');
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
        }
      }
      const result = assetHeaders(bundle, options, existing, reservedDirectory);
      emitted = new Set(result.files);
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: result.source,
      });
    },
    closeBundle: {
      order: 'post',
      sequential: true,
      handler() {
        if (
          this.environment.name !== 'client' ||
          !reservedDirectory ||
          !outputDir
        )
          return;
        const visit = (relative: string) => {
          for (const entry of readdirSync(path.join(outputDir, relative), {
            withFileTypes: true,
          })) {
            const file = `${relative}/${entry.name}`;
            if (entry.isDirectory()) visit(file);
            else if (!entry.isFile() || !emitted.has(file)) {
              throw new Error(
                `Non-emitted file in reserved immutable directory: ${file}`
              );
            }
          }
        };
        visit(directory);
      },
    },
  };
}
