import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'prefer-const': 'off',
      'react/no-string-refs': 'off',
      'react/display-name': 'off',
      'react/require-render-return': 'off',
      'react/no-direct-mutation-state': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
    ignores: [
      'src/payload-types.ts',
      '.tmp',
      '.git',
      '.hg',
      '.pnp.*',
      '.svn',
      '.yarn/**',
      'build',
      'dist/**',
      'node_modules/**',
      'temp/**',
      'playwright.config.ts',
      'jest.config.js',
    ],
  },
]

export default eslintConfig
