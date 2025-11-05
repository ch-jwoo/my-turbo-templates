import { nodeJsConfig } from "@repo/eslint-config/node";

export default [
  {
    ignores: ['**/*.json', 'eslint.config.js'],
  },
  ...nodeJsConfig,
];
