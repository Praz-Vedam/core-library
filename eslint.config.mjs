import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: ['dist/', 'build/', 'node_modules/', '*.min.js', 'coverage/'],
  },

  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // TypeScript already validates symbol resolution; ESLint's `no-undef`
      // doesn't know about lib.dom types like `RequestCredentials`.
      'no-undef': 'off',
    },
  },

  {
    plugins: { prettier },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          printWidth: 100,
          endOfLine: 'auto',
          tabWidth: 2,
          useTabs: false,
        },
      ],
    },
  },

  {
    rules: {
      'no-console': 'off',
      'no-debugger': 'warn',
    },
  },
];
