import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            prettier: prettierPlugin,
        },
        rules: {
            ...eslint.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...tseslint.configs['recommended-type-checked'].rules,
            ...prettierConfig.rules,
            'prettier/prettier': 'warn',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off',
        },
    },
    {
        files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.jest,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            prettier: prettierPlugin,
        },
        rules: {
            ...eslint.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...tseslint.configs['recommended-type-checked'].rules,
            ...prettierConfig.rules,
            'prettier/prettier': 'warn',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off',
        },
    },
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**'],
    },
];