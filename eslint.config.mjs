import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/logs/**',
      '**/.scannerwork/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Every exported function/component must declare its parameter and return types.
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
      'prefer-const': 'error',
    },
  },

  // Plain JS / config files: no type information.
  {
    files: ['**/*.{js,cjs,mjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Backend
  {
    files: ['server/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['server/test/**/*.ts'],
    languageOptions: { globals: { ...globals.mocha } },
    rules: {
      // Chai assertions such as `expect(x).to.be.true` are property accesses.
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // Frontend
  {
    files: ['client/src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['client/src/**/*.test.{ts,tsx}', 'client/src/test/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.jest } },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  prettier,
);
