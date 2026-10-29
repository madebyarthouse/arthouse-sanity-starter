import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import test from 'node:test';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build, transformWithEsbuild } from 'vite';

const filename = new URL('./immutable-assets.ts', import.meta.url);
const { code } = await transformWithEsbuild(
  await readFile(filename, 'utf8'),
  filename.pathname,
  { loader: 'ts' }
);
const { assetHeaders, immutableAssets } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
);

const options = {
  entryFileNames: 'assets/[name]-[hash].js',
  chunkFileNames: 'assets/[name]-[hash].js',
  assetFileNames: 'assets/[name]-[hash][extname]',
};
const chunk = (fileName) => ({ type: 'chunk', fileName, isEntry: true });
const asset = (fileName) => ({ type: 'asset', fileName });

test('only emitted hashed JS/CSS get rules; manifests, stable names and other files do not', () => {
  const bundle = Object.fromEntries(
    [
      chunk('assets/app-abc12345.js'),
      chunk('assets/lazy-def67890.js'),
      asset('assets/style-abc12345.css'),
      chunk('assets/manifest-abc12345.js'),
      chunk('service-worker.js'),
      asset('assets/photo-abc12345.webp'),
      asset('manifest.json'),
      asset('index.html'),
      asset('assets/app-abc12345.js.map'),
    ].map((entry) => [entry.fileName, entry])
  );
  const { files, source } = assetHeaders(
    bundle,
    options,
    '/*\n  X-Content-Type-Options: nosniff\n'
  );
  assert.deepEqual(files, [
    'assets/app-abc12345.js',
    'assets/lazy-def67890.js',
    'assets/style-abc12345.css',
  ]);
  assert.match(source, /X-Content-Type-Options: nosniff/);
  assert.equal(source.match(/immutable\n/g).length, 3);
  assert.doesNotMatch(source, /manifest|service-worker|\.webp|\.html|\.map/);
});

test('a hash-looking stable output name does not qualify', () => {
  assert.throws(
    () =>
      assetHeaders(
        { a: chunk('assets/app-abc12345.js') },
        { ...options, entryFileNames: 'assets/app-abc12345.js' }
      ),
    /No emitted hashed/
  );
});

test('fails instead of truncating rules or overriding an existing cache policy', () => {
  const bundle = Object.fromEntries(
    Array.from({ length: 101 }, (_, i) => [
      i,
      chunk(`assets/chunk${i}-abc12345.js`),
    ])
  );
  assert.throws(() => assetHeaders(bundle, options), /at most 100/);
  assert.throws(
    () =>
      assetHeaders(
        { a: chunk('assets/app-abc12345.js') },
        options,
        '/*\n  Cache-Control: no-store\n'
      ),
    /Reconcile existing/
  );
});

test('reserved emitted directory handles large bundles without widening file eligibility', () => {
  const bundle = Object.fromEntries(
    Array.from({ length: 325 }, (_, i) => [
      i,
      chunk(`assets/immutable/chunk${i}-abc12345.js`),
    ])
  );
  const { files, source } = assetHeaders(bundle, options, '', true);
  assert.equal(files.length, 325);
  assert.equal(source.match(/Cache-Control:/g).length, 1);
  assert.match(source, /\/assets\/immutable\/\*/);
  assert.throws(
    () =>
      assetHeaders(
        { a: chunk('assets/outside-abc12345.js') },
        options,
        '',
        true
      ),
    /escaped/
  );
});

test('real Vite builds keep copied files out and reject foreign files in the reserved directory', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'immutable-assets-'));
  try {
    await mkdir(path.join(root, 'public'), { recursive: true });
    await writeFile(
      path.join(root, 'index.html'),
      '<script type="module" src="/main.js"></script>'
    );
    await writeFile(
      path.join(root, 'main.js'),
      "import './style.css'; import('./lazy.js').then(console.log);"
    );
    await writeFile(path.join(root, 'lazy.js'), 'export default 42;');
    await writeFile(path.join(root, 'style.css'), 'body { color: red; }');
    await writeFile(
      path.join(root, 'public/copied-abc12345.js'),
      'console.log(42);'
    );
    await writeFile(path.join(root, 'public/manifest.json'), '{}');
    const run = (reservedDirectory) =>
      build({
        root,
        configFile: false,
        logLevel: 'silent',
        plugins: [immutableAssets({ reservedDirectory })],
      });
    await run(false);
    const exact = await readFile(path.join(root, 'dist/_headers'), 'utf8');
    assert.match(exact, /\.js\n/);
    assert.match(exact, /\.css\n/);
    assert.doesNotMatch(exact, /copied|manifest|index.html/);
    await run(true);
    assert.match(
      await readFile(path.join(root, 'dist/_headers'), 'utf8'),
      /\/assets\/immutable\/\*/
    );
    await mkdir(path.join(root, 'public/assets/immutable'), {
      recursive: true,
    });
    await writeFile(
      path.join(root, 'public/assets/immutable/stable.js'),
      'console.log(0);'
    );
    await assert.rejects(
      run(true),
      /Non-emitted file in reserved immutable directory/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
