import { cpSync, existsSync } from 'node:fs';

// Redundant while Turbopack honours next.config.ts's outputFileTracingIncludes, which it currently
// does. That is undocumented, and a standalone deploy missing this file fails every submission at
// runtime rather than at build time, so copy it again and keep the guarantee cheap.
const standalone = '.next/standalone';

if (!existsSync(standalone)) {
  console.log(`${standalone} not found, skipping worker copy`);
  process.exit(0);
}

cpSync('dist/workers', `${standalone}/dist/workers`, { recursive: true });
console.log(`copied dist/workers into ${standalone}`);
