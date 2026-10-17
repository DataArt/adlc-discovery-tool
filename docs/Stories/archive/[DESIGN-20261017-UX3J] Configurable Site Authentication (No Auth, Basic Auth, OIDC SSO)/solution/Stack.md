# DESIGN-20261017-UX3J: Configurable Site Authentication — Stack

_Confirmed technology choices only. Alternatives and selection rationale live in `design/02 Evaluate.md`. Unchanged technologies (TypeScript, Node.js 22 runtime, CDK, esbuild as a bundler) are not re-listed here — only what actually changes for this design._

## Technology-to-responsibility table

| Technology                        | Responsibility                                                                                                                                                                        | Owner              | Version                                          | Change type                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------ | --------------------------------- |
| `jose`                            | JWT signature verification and remote JWKS fetch/cache, used by `lib/jwks.ts`                                                                                                         | `apps/lambda-auth` | `^5.x` (latest stable at implementation time)    | New dependency                    |
| `node:crypto` (built-in)          | Extended usage: PKCE verifier/challenge generation (`randomBytes` + `createHash('sha256')`, S256 method) and HMAC-SHA256 session/PKCE cookie signing (`lib/cookie.ts`, `lib/pkce.ts`) | `apps/lambda-auth` | Node 22 built-in (unchanged runtime)             | Extended usage, no new dependency |
| `@aws-sdk/client-secrets-manager` | Reads the extended secret payload (D6) — same client, same `GetSecretValueCommand` call                                                                                               | `apps/lambda-auth` | `^3.0.0` (unchanged, per current `package.json`) | Unchanged                         |
| No new AWS service                | —                                                                                                                                                                                     | —                  | —                                                | Confirmed absence                 |

No Cognito or any additional managed AWS service is introduced. The design stays within the existing Lambda@Edge + Secrets Manager footprint, confirming Architecture.md's decision to keep `apps/infra`'s provisioned resources unchanged.

## `jose` — capability and compatibility

**Capability.** `jose` provides JWT/JWS signature verification and remote JWKS fetching with built-in caching, implemented against Web Crypto / `node:crypto` primitives rather than Node-version-specific native bindings. This is the library `lib/jwks.ts`'s `getJwks()`/`verifySignature()` functions are built on.

**Compatibility.** `jose` is deliberately selected over heavier alternatives (MSAL, or `jsonwebtoken` paired with a separate JWKS-fetching library) specifically for its small footprint and absence of Node-version-specific dependencies — consistent with Architecture.md D2's "no MSAL, hand-rolled authorization-code + PKCE" decision. It must bundle via esbuild into the same single-file `dist/index.js` output `build.ts` already produces (`format: 'cjs'`), within the practical Lambda@Edge code-size constraint noted in `Auth.md` (1MB response-size-adjacent limit). Recent major versions of `jose` ship as ESM-only; esbuild's bundler resolves this transparently when bundling into a CJS output, but this conversion should be verified against the actual bundle during implementation (a build-time smoke test), not assumed from the package's published `exports` map alone.

**Licensing.** MIT — no new licensing obligation.

**Ownership.** `apps/lambda-auth`, scoped to `handler-oidc.ts` and `lib/jwks.ts` only; `handler-none.ts` and `handler-basic.ts` must never import it (see per-mode bundle constraint below).

## `node:crypto` — extended usage

No new dependency. `node:crypto` is already used by today's `handler-basic.ts` for SHA-256 hashing and `timingSafeEqual`. This design adds two new call sites within the same built-in module: PKCE code-verifier/challenge generation (`lib/pkce.ts`) and HMAC-SHA256 signing/verification of the session and PKCE cookies (`lib/cookie.ts`). This carries no bundle-size cost and introduces no new external audit surface beyond Node's own crypto module.

## `@aws-sdk/client-secrets-manager` — unchanged

Confirmed from `apps/lambda-auth/build.ts`: the package is already declared `external: ['@aws-sdk/client-secrets-manager']` in the esbuild config, so it is not bundled into `dist/index.js` — it is provided by the Lambda@Edge Node 22 runtime. This design's extended secret payload (D6) is a larger JSON body returned by the same `GetSecretValueCommand` call; no client API change, no version bump required against the current `^3.0.0` devDependency pin in `apps/lambda-auth/package.json`.

## Compatibility / build constraints

- `jose`'s package exports must resolve correctly under esbuild's `format: 'cjs'` bundling — esbuild converts ESM dependencies during bundling, but this must be verified against the actual built `dist/index.js` artifact during implementation, not assumed from documentation.
- Per-mode bundle isolation (Architecture.md D1): `handler-none.ts`'s bundled output must not pull in `jose`, `@aws-sdk/client-secrets-manager`, or any OIDC-related `lib/` module. This is verified by inspecting the built `dist/index.js` for the `none` mode, not by code review alone.

## Migration / rollback

- Adding `jose` to `apps/lambda-auth/package.json` is additive — no existing dependency is replaced, removed, or upgraded as part of this design.
- Rollback: reverting an instance to `AUTH_MODE=basic` (or leaving it unset, which defaults to `basic` per D1) requires no dependency changes — `handler-basic.ts`'s bundle never imports `jose`.

## Verification

- PR review includes the lockfile diff introducing `jose` as a new dependency (standard supply-chain review, not a new process).
- Per-mode bundle-size/content check confirms `handler-none.ts`'s built output contains neither `jose` nor `@aws-sdk/client-secrets-manager`, and that the overall `dist/index.js` size for `basic`/`oidc` modes stays within the Lambda@Edge practical limit referenced in `Auth.md`.
