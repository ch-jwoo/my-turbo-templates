// @ts-check
import { baseConfig } from './base.js';
import globals from 'globals';

/**
 * ESLint configuration for Next.js projects
 * @type {import("typescript-eslint").ConfigArray}
 */
export const nextConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
      },
    },

    rules: {
      'import/no-default-export': 'off',
      'react/jsx-sort-props': 'off',
    },
  },
];
