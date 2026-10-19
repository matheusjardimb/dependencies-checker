import github from 'eslint-plugin-github'
import jest from 'eslint-plugin-jest'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import globals from 'globals'

export default [
    {
        ignores: ['dist/', 'lib/', 'node_modules/', 'jest.config.js']
    },
    github.getFlatConfigs().recommended,
    {
        files: ['**/*.ts'],
        plugins: {
            jest,
            '@typescript-eslint': tsPlugin
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 9,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.eslint.json'
            },
            globals: {
                ...globals.node,
                ...globals.es2015,
                ...jest.environments.globals.globals
            }
        },
        rules: {
            'i18n-text/no-en': 'off',
            'eslint-comments/no-use': 'off',
            'import/no-namespace': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {caughtErrors: 'none'}],
            '@typescript-eslint/explicit-member-accessibility': ['error', {accessibility: 'no-public'}],
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-ts-comment': 'error',
            camelcase: 'off',
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/explicit-function-return-type': ['error', {allowExpressions: true}],
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/no-empty-object-type': ['error', {allowObjectTypes: 'always'}],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-extraneous-class': 'error',
            '@typescript-eslint/no-for-in-array': 'error',
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-unnecessary-qualifier': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-useless-constructor': 'error',
            '@typescript-eslint/prefer-for-of': 'warn',
            '@typescript-eslint/prefer-function-type': 'warn',
            '@typescript-eslint/prefer-includes': 'error',
            '@typescript-eslint/prefer-string-starts-ends-with': 'error',
            '@typescript-eslint/promise-function-async': 'error',
            '@typescript-eslint/require-array-sort-compare': 'error',
            '@typescript-eslint/restrict-plus-operands': 'error',
            semi: 'off',
            '@typescript-eslint/unbound-method': 'error'
        }
    },
    {
        files: ['tests/**/*.ts'],
        rules: {
            'github/filenames-match-regex': 'off'
        }
    }
]
