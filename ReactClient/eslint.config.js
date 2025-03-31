import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import stylisticTs from '@stylistic/eslint-plugin-ts'
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylistic from '@stylistic/eslint-plugin'


export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], languageOptions: { globals: globals.browser } },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], 
    plugins: { 
      js,
      '@stylistic/ts': stylisticTs,
      '@stylistic/js': stylisticJs,
      '@stylistic': stylistic,
    }, extends: ['js/recommended'],
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'import/no-unresolved': 'off',
      'import/no-absolute-path': 'off',
      'linebreak-style': 0,
      'react/prop-types': 'off',
      'class-methods-use-this': 0,
      'react/state-in-constructor': 0,
      'react/jsx-props-no-spreading': 0,
      'simple-import-sort/imports': 'off',
      'import/no-extraneous-dependencies': 0,
      'import/prefer-default-export': 0,
      'default-param-last': 0,
      'func-style': 'off',
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'no-unused-vars': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-shadow': 'error',
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      'no-param-reassign': 'off',
      camelcase: 'off',
      'max-len': ['warn', { code: 120 }],
    }, },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);