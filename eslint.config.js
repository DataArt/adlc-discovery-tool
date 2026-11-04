// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, prettier, {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/cdk.out/**',
    'raw-artifacts/**',
    '**/.vitepress/dist/**',
    '**/.vitepress/cache/**',
    '.nx/**',
    '.yarn/**',
    '.harness/skills/**',
    '.agents/skills/**',
    '.claude/skills/**',
    '.patch/**',
  ],
});
