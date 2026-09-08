import { mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

const outfile = 'dist/workers/verify-worker.cjs';
const metafile = 'dist/workers/verify-worker.meta.json';

const result = await build({
  entryPoints: ['src/workers/verify-worker.ts'],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'cjs',
  // PdaExecutor uses Array.prototype.toReversed and .at(-1); tsconfig's ES2017 target would be wrong.
  target: 'node20',
  tsconfig: 'tsconfig.json',
  sourcemap: 'inline',
  metafile: true,
});

await mkdir('dist/workers', { recursive: true });
await writeFile(metafile, JSON.stringify(result.metafile, null, 2));

const inputs = Object.keys(result.metafile.inputs);
const leaked = inputs.filter((input) => input.includes('node_modules'));
if (leaked.length > 0) {
  console.error(`${outfile} must stay dependency-free, but it bundled:`);
  for (const input of leaked) console.error(`  ${input}`);
  process.exit(1);
}

console.log(`${outfile} built from ${inputs.length} inputs`);
