// @ts-check
import { baseConfig } from './base.js';
import globals from 'globals';

/**
 * ESLint configuration for internal React libraries
 * @type {import("typescript-eslint").ConfigArray}
 */
export const reactInternalConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
  },
];
