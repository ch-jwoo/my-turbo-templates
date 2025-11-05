// @ts-check
import { baseConfig } from './base.js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

/**
 * ESLint configuration for Node.js projects
 * @type {import("typescript-eslint").ConfigArray}
 */
export const nodeJsConfig = [
  ...baseConfig,
  eslintConfigPrettier,
  {
    files: ['**/*.ts', '**/*.mts'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
    },

    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'always',
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-invalid-this': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
    },
  },
];
