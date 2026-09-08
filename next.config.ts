import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  output: 'standalone',
  cacheComponents: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Ships the prebuilt judge worker into .next/standalone; Next never bundles it, so nothing else
  // would trace it. `npm run build:worker:standalone` re-copies it afterwards, because Turbopack
  // honouring these includes is undocumented behaviour we would rather not stake a deploy on.
  outputFileTracingIncludes: {
    '/**': ['./dist/workers/verify-worker.cjs'],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-math'],
    rehypePlugins: ['rehype-katex'],
  },
});

export default withMDX(nextConfig);
