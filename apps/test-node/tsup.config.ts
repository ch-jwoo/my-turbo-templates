import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  noExternal: ['@repo/node-jit'], // @repo/node-jit만 번들링
  target: 'node18',
  splitting: false,
  sourcemap: false,
  minify: false,
});
