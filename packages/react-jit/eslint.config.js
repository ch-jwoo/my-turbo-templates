import { reactInternalConfig } from "@repo/eslint-config/react-internal";

export default [
  {
    ignores: ['**/*.json', 'eslint.config.js'],
  },
  ...reactInternalConfig,
];
