// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import turboPlugin from 'eslint-config-turbo/flat';

/**
 * Base ESLint configuration for TypeScript projects
 * @type {import("typescript-eslint").ConfigArray}
 */
export const baseConfig = [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/build/**', '**/tmp/**', '**/coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...turboPlugin,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.js', '**/*.jsx'],

    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
