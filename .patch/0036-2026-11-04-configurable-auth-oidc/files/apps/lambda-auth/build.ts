import * as esbuild from 'esbuild';

export type AuthMode = 'none' | 'basic' | 'oidc';

/** Resolves and validates `AUTH_MODE`. Unset defaults to `basic` (D1 migration
 * default — zero required action for already-deployed instances). An explicit
 * value outside `{none, basic, oidc}` throws before any esbuild call. */
export function resolveAuthMode(raw: string | undefined): AuthMode {
  if (raw === undefined) return 'basic';
  if (raw === 'none' || raw === 'basic' || raw === 'oidc') return raw;
  throw new Error(`AUTH_MODE must be one of none|basic|oidc, got: ${raw}`);
}

const SM_SECRET_NAME = process.env['SM_SECRET_NAME'];
const AWS_REGION = process.env['AWS_REGION'];

if (!SM_SECRET_NAME) throw new Error('SM_SECRET_NAME must be set');
if (!AWS_REGION) throw new Error('AWS_REGION must be set');

const AUTH_MODE = resolveAuthMode(process.env['AUTH_MODE']);

// D10: a build-time-only warning when AUTH_MODE=none is explicitly resolved — the
// unset-defaults-to-basic path can never reach this branch. Informational only;
// does not fail the build.
if (AUTH_MODE === 'none') {
  console.log(
    '⚠️  AUTH_MODE=none — this instance will have NO access control. Do not use for any instance serving real/non-public content.'
  );
}

esbuild
  .build({
    entryPoints: [`src/handler-${AUTH_MODE}.ts`],
    bundle: true,
    platform: 'node',
    target: 'node22',
    format: 'cjs',
    outfile: 'dist/index.js',
    external: ['@aws-sdk/client-secrets-manager'],
    define: {
      'process.env.SM_SECRET_NAME': JSON.stringify(SM_SECRET_NAME),
      'process.env.AWS_REGION': JSON.stringify(AWS_REGION),
    },
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
