# Patch 0036 — configurable-auth-oidc

**Base ref:** `9837e20` (chore(release): 1.8.0)
**Head ref:** `c145711` (fix(auth): make lambda-auth build cache depend on AUTH_MODE/SM vars)

## Summary

Implements a deploy-time `AUTH_MODE` selector (`none` | `basic` | `oidc`) in
`apps/lambda-auth`, replacing the old single-mode Basic Auth handler. Unset
`AUTH_MODE` defaults to `basic` — zero required action for already-deployed
instances. `none` mode is an unconditional pass-through; `basic` mode is the
previous `handler.ts` relocated verbatim with unchanged behavior; `oidc` mode
is a new, full Entra ID OAuth2 authorization-code + PKCE flow (login,
steady-state JWT/JWKS verification with issuer check, silent token refresh via
a same-URI redirect, fail-closed on any verification failure, same-origin-only
post-login redirects, session/PKCE cookies with `__Host-` prefix and byte
budgets, attribution logging for NFR-7).

Also includes a fix to the project's GitHub Actions → AWS OIDC trust policy
(`apps/infra/lib/ci-stack.ts`'s `CiReadRole`): the `event_name` claim
condition never successfully matched when combined with the job's
`environment: dev` declaration (confirmed via CloudTrail — the `sub` claim
matched exactly, but the role had never been successfully assumed). Replaced
with a `ref`-based condition (`refs/pull/*`), the same claim type already
proven to work via the sibling `DeployRole`.

**Out of scope for this bundle** (deliberately excluded — ask if you want a
separate bundle for these): the root `vitest`/`vite` dependency bump and the
`eslint.config.js` ignores fix from the same session. Both are generic
tooling fixes, not part of the auth feature or the CI trust-policy fix.

**Critical, discovered-live bug fix included**: `apps/lambda-auth/project.json`'s
`build` target's NX cache key only covered `{projectRoot}/**` file content —
never the `AUTH_MODE`/`SM_SECRET_NAME`/`AWS_REGION` env vars that actually
determine the build output. Since `.env.dev` is gitignored, switching
`AUTH_MODE` and rebuilding silently served a stale cached bundle from before
the switch (confirmed live against a real deployed Lambda version — a
redeploy after switching `oidc` → `basic` still shipped the `oidc` bundle to
CloudFront). Without this fix, **any instance that later changes `AUTH_MODE`
will silently keep deploying its previous mode's code.** This is now fixed by
declaring those three vars as explicit cache inputs.

**Note on `project.json` in the target repo**: this file (and the other
apps' `project.json` files) may have git's **skip-worktree** bit set locally
in a bootstrapped client repo — the committed version carries `{org}`
template placeholders, while the working copy has the real org value filled
in by the bootstrap process. That bit is local-only `.git/index` state, never
committed or shared, so applying this patch is unaffected either way; just be
aware that `git status`/`git diff` on this file may show nothing locally even
after `/patch-apply` writes it, until `git update-index --no-skip-worktree
apps/lambda-auth/project.json` is run first (then restore the local org value
and re-apply skip-worktree afterward, same as done when this patch was
prepared).

**Per-instance follow-up required after applying**: this bundle does **not**
include any Entra ID app-registration credentials or this repo's own
`.env.dev`/`.secrets.dev` configuration (both gitignored, and specific to the
canonical instance). The target repo must:

1. Request its own Entra ID app registration (D8 — external, manual, via
   Admins Helpdesk), registering its own CloudFront redirect URI under
   `/_auth/callback` on the **Web** platform (not SPA).
2. Decide whether to default to `oidc` mode (`AUTH_MODE=oidc` in
   `apps/lambda-auth/.env.{env}`) or keep the `basic` default.
3. Populate its own `.secrets.{env}` with `OIDC_CLIENT_ID`/`OIDC_CLIENT_SECRET`/
   `OIDC_TENANT_ID`/`OIDC_SESSION_SIGNING_KEY` (the last freshly generated via
   `openssl rand -base64 32`, never shared across instances) and push via
   `yarn nx run lambda-auth:sm-push`.
4. Confirm its own repo's `GITHUB_ORG_ID`/`GITHUB_REPO_ID` in
   `apps/infra/.env.{env}` match its real numeric GitHub IDs before
   redeploying `CiStack` — these are baked into the OIDC trust policy's `sub`
   condition and are unique per repo.

Known open follow-up from the source repo (tracked there as TD-1/TD-2/TD-3,
not resolved in this bundle): live end-to-end sign-in validation, JWT
`audience` claim validation (deferred to the pre-production security review
Architecture.md D2 already requires), and confirming `requestId` /
`x-edge-request-id` equivalence for NFR-7 attribution.

## Added

- `apps/lambda-auth/build.spec.ts`
- `apps/lambda-auth/src/handler-none.ts`
- `apps/lambda-auth/src/handler-none.spec.ts`
- `apps/lambda-auth/src/handler-oidc.ts`
- `apps/lambda-auth/src/handler-oidc.spec.ts`
- `apps/lambda-auth/src/lib/cookie.ts`
- `apps/lambda-auth/src/lib/cookie.spec.ts`
- `apps/lambda-auth/src/lib/jwks.ts`
- `apps/lambda-auth/src/lib/jwks.spec.ts`
- `apps/lambda-auth/src/lib/pkce.ts`
- `apps/lambda-auth/src/lib/pkce.spec.ts`
- `apps/lambda-auth/src/lib/redirect.ts`
- `apps/lambda-auth/src/lib/redirect.spec.ts`

## Renamed

- `apps/lambda-auth/src/handler.ts` → `apps/lambda-auth/src/handler-basic.ts` (content unchanged, verbatim)
- `apps/lambda-auth/src/handler.spec.ts` → `apps/lambda-auth/src/handler-basic.spec.ts` (import path updated only)

## Updated

- `apps/infra/lib/ci-stack.ts` — `CiReadRole` trust policy: `event_name` condition replaced with `ref: refs/pull/*`
- `apps/lambda-auth/.env.example` — documents `AUTH_MODE`
- `apps/lambda-auth/.secrets.example` — documents `OIDC_CLIENT_ID`/`OIDC_CLIENT_SECRET`/`OIDC_TENANT_ID`/`OIDC_SESSION_SIGNING_KEY`
- `apps/lambda-auth/build.ts` — `AUTH_MODE` deploy-time selector (`resolveAuthMode()`), migration default to `basic`, `none`-mode stdout warning
- `apps/lambda-auth/package.json` — adds `jose` dependency
- `apps/lambda-auth/project.json` — `build` target now declares `AUTH_MODE`/`SM_SECRET_NAME`/`AWS_REGION` as explicit NX cache inputs (see note below)
- `docs/System Architecture (LLD)/Auth/00. Overview.md` — full rewrite for the three-mode implementation
- `docs/Target Architecture (HLD)/v1/Containers/Auth.md` — Flow 3 sequence diagram corrected to the actual redirect-based silent-refresh mechanism

## Deleted

None (the two deletions under this diff are the old-path half of the two Renamed entries above, not independent deletions).
