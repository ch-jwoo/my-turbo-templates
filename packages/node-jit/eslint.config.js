import { nodeJsConfig } from '@repo/eslint-config/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    languageOptions: {
      parserOptions: {
        rootDir: __dirname,
      },
    },
    ignores: ['**/*.json', 'eslint.config.js'],
  },
  ...nodeJsConfig,
];
