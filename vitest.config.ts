import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    exclude: ['**/node_modules/**', 'tests/e2e/**'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@prisma': path.resolve(__dirname, './prisma/generated'),
    },
  },
});
