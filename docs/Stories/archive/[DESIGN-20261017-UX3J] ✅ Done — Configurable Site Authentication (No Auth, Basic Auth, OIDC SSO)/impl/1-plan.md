# DESIGN-20261017-UX3J: Configurable Site Authentication (No Auth / Basic Auth / OIDC SSO)

| Field   | Value                                         |
| ------- | --------------------------------------------- |
| Ticket  | DESIGN-20261017-UX3J                          |
| Branch  | `feat/design-20261017-ux3j-configurable-auth` |
| Created | 2026-11-04                                    |

## Context

BSIMM review flagged this site's single shared Basic Auth password as having no per-user
identity/attribution and no password policy. An already-approved, already-published design
(`docs/Stories/archive/[DESIGN-20261017-UX3J] .../solution/{Architecture,Design,Stack,Efforts}.md`,
decision register D1–D10) specifies a deploy-time `AUTH_MODE` selector (`none`/`basic`/`oidc`)
in `apps/lambda-auth`, so each deployed docs-site instance can run no auth, today's shared-password
Basic Auth (unchanged), or direct Entra ID OIDC SSO with per-user identity, silent refresh, and
attribution logging — with exactly one mode's code shipped per build (no dead auth-protocol code).

Entra ID app registrations now exist for both the canonical (template) instance and a Collinson
instance. This repo is the canonical instance. This plan implements the full design here, then
configures this repo's dev deploy config to default to `oidc` mode wired to the canonical app
registration. The Collinson instance's credentials are out of scope (separate repo).

The target architecture doc (`docs/Target Architecture (HLD)/v1/Containers/Auth.md`) and NFR-1/6/7/8
already reflect this design (published at the design's Publish stage) — no further doc changes are
expected unless implementation surfaces a gap.

## Scope

**In scope:**

- `apps/lambda-auth/src/lib/{cookie,pkce,redirect,jwks}.ts` — new shared helpers, each with its own spec
- `apps/lambda-auth/src/handler-none.ts`, `handler-basic.ts` (relocated from `handler.ts`, unchanged
  behavior), `handler-oidc.ts` (new, full OIDC flow) — one bundled per build
- `apps/lambda-auth/build.ts` — `AUTH_MODE` selector, migration default to `basic`, invalid-value
  guard, `none`-mode stdout warning (D10)
- `apps/lambda-auth/package.json` — add `jose` dependency
- `.env.example`/`.secrets.example` — document new fields
- This repo's `.env.dev` → `AUTH_MODE=oidc`; `.secrets.dev` (gitignored, never committed) → real
  canonical Entra credentials + a freshly generated `OIDC_SESSION_SIGNING_KEY`
- Full verification coverage per `solution/Design.md`'s obligations table

**Out of scope:**

- `apps/infra` — CDK-managed resources are unchanged per Architecture.md (confirmed, no action)
- Collinson instance configuration (separate repo)
- Efforts.md Ticket #3 (independent security review, load/latency test, runbook) — pre-production
  gate, tracked but not blocking this implementation
- Actually running `sm-push`/deploying — guarded/developer-run

## Acceptance Criteria

- [ ] `AC-1` — `yarn nx run lambda-auth:build` with `AUTH_MODE` unset selects `handler-basic.ts`'s
      content in `dist/index.js` (grep for a `handler-basic`-only string/behavior marker); no
      stdout warning printed
- [ ] `AC-2` — `AUTH_MODE=none yarn nx run lambda-auth:build` selects `handler-none.ts`'s content
      and prints a no-access-control warning to stdout
- [ ] `AC-3` — `AUTH_MODE=oidc yarn nx run lambda-auth:build` selects `handler-oidc.ts`'s content
      and bundles `jose`; no warning printed
- [ ] `AC-4` — `AUTH_MODE=bogus yarn nx run lambda-auth:build` exits non-zero before invoking
      esbuild, no `dist/index.js` written
- [ ] `AC-5` — `yarn nx run lambda-auth:test` passes, covering: `handler-none` pass-through;
      `handler-basic`'s full existing suite (relocated, unchanged); every row of Design.md's
      `handler-oidc` error-handling table; `lib/cookie.ts` attribute + byte-budget assertions;
      `lib/jwks.ts` accept/reject against a fixture JWKS; `lib/pkce.ts` state validation;
      `build.ts`'s mode-selection/warning behavior
- [ ] `AC-6` — `yarn nx run lambda-auth:typecheck` passes with no new `any`/suppressions
- [ ] `AC-7` — a built `none`-mode `dist/index.js` contains neither `jose` nor
      `@aws-sdk/client-secrets-manager` (grep the bundle)
- [ ] `AC-8` — this repo's `apps/lambda-auth/.env.dev` has `AUTH_MODE=oidc`; `.secrets.dev` (not
      committed — verified via `git status`) contains the canonical app's `OIDC_CLIENT_ID`,
      `OIDC_CLIENT_SECRET`, `OIDC_TENANT_ID`, and a freshly generated `OIDC_SESSION_SIGNING_KEY`
- [ ] `AC-9` — no secret value appears in any file tracked by git (`git grep` across the diff)
- [ ] `AC-10` — every `Set-Cookie` header `handler-oidc.ts` emits uses the exact names
      `__Host-docs_session`/`__Host-docs_pkce`, and the PKCE cookie carries `Max-Age=600`
      (Design.md §Changed interfaces/contracts)

## Dependencies

None — design and docs are already approved/published; this is pure implementation.

## Steps

### Step 1 — lambda-auth: `lib/redirect.ts` (same-origin redirect-target guard)

**Changes:**

- `apps/lambda-auth/src/lib/redirect.ts` — `sanitizeRedirectTarget(candidate?: string): string`;
  accepts only a leading-`/`, non-protocol-relative (`//...`), same-origin relative path; anything
  else (absolute URL, `//evil.com`, backslash tricks) falls back to `/` (D2 open-redirect fix, NFR-8)
- `apps/lambda-auth/src/lib/redirect.spec.ts` — unit tests: valid relative path passthrough;
  absolute URL → `/`; protocol-relative `//evil.com` → `/`; `javascript:`/backslash variants → `/`;
  empty/undefined → `/`

**Verification:**

> Run: `yarn nx run lambda-auth:test -- redirect.spec`
> Expected: all cases pass, including the crafted-redirect rejection cases

### Step 2 — lambda-auth: `lib/pkce.ts` (PKCE + state generation/validation)

**Changes:**

- `apps/lambda-auth/src/lib/pkce.ts` — `generatePkce(): { verifier, challenge, state }` using
  `node:crypto` `randomBytes` + `createHash('sha256')` (S256 method, base64url encoding);
  `validateState(expected, received): boolean` (plain equality is fine — state isn't secret, PKCE
  verifier is the actual CSRF-binding secret)
- `apps/lambda-auth/src/lib/pkce.spec.ts` — unit tests: challenge is the correct S256 hash of the
  verifier; verifier/state are sufficiently random (basic entropy/length check, not a statistical
  test); `validateState` accepts a match, rejects mismatch/missing

**Verification:**

> Run: `yarn nx run lambda-auth:test -- pkce.spec`
> Expected: all cases pass

### Step 3 — lambda-auth: `lib/cookie.ts` (session + PKCE cookie sign/verify/parse)

**Changes:**

- `apps/lambda-auth/src/lib/cookie.ts` — `signSessionCookie`/`verifySessionCookie`,
  `signPkceCookie`/`verifyPkceCookie` (HMAC-SHA256 over base64url JSON payload, `.`-joined
  signature, `timingSafeEqual` compare); `assertByteBudget(cookieValue, maxBytes = 4096): void`
  throwing `CookieBudgetExceededError` on overflow. Session payload shape exactly
  `{at, rt, sub, upn, exp}` per Design.md — no ID token, no optional claims. Cookie names are
  exported constants used by both this module and `handler-oidc.ts`: `SESSION_COOKIE_NAME =
'__Host-docs_session'`, `PKCE_COOKIE_NAME = '__Host-docs_pkce'` (Design.md §Changed
  interfaces/contracts — the `__Host-` prefix enforces `Secure`, `Path=/`, no `Domain` at the
  browser level, per D5). `signPkceCookie` sets a 10-minute TTL (`Max-Age=600`) in the returned
  `Set-Cookie` string, bounding the Entra redirect round-trip per Design.md.
- `apps/lambda-auth/src/lib/cookie.spec.ts` — sign→verify round-trip; tampered signature rejected;
  wrong key rejected; malformed base64/JSON rejected (returns `null`, never throws on bad input
  except the explicit budget check); a representative `{at,rt,sub,upn,exp}` payload with realistic
  token lengths serializes under 4096 bytes; an oversized payload throws from `assertByteBudget`;
  the PKCE `Set-Cookie` string includes `Max-Age=600`; both cookie-name constants match
  `__Host-docs_session`/`__Host-docs_pkce` exactly

**Verification:**

> Run: `yarn nx run lambda-auth:test -- cookie.spec`
> Expected: all cases pass, including the byte-budget assertion

### Step 4 — lambda-auth: `lib/jwks.ts` (JWKS fetch/cache + signature verification)

**Changes:**

- `apps/lambda-auth/package.json` — add `jose` (`^5.x`) to `dependencies` (bundled into the
  shipped artifact, per Stack.md — not `external`)
- `apps/lambda-auth/src/lib/jwks.ts` — `getJwks(issuerUrl): ReturnType<typeof jose.createRemoteJWKSet>`
  cached in module scope per cold start (mirrors today's `cachedHash` pattern — one fetch per
  Lambda@Edge execution environment, no TTL re-fetch policy, matching Design.md's "fetch once per
  cold start" and the Research-phase OQ-4 "acceptable risk, document cache TTL policy" resolution);
  `verifySignature(token, jwks): Promise<boolean>` wraps `jose.jwtVerify`, catching and returning
  `false` on any verification failure (tampered, wrong `kid`, expired — expiry is handled
  separately by the handler's own `exp` check, so pass `clockTolerance` generously here and let the
  handler decide expiry-based branching)
- `apps/lambda-auth/src/lib/jwks.spec.ts` — generate a local test keypair/JWKS fixture (via `jose`
  itself, e.g. `generateKeyPair` + `exportJWK`), sign a token with it, assert `verifySignature`
  accepts it; assert it rejects a token signed with a different key and a tampered-payload token

**Implementation note (deviation from Design.md's illustrative signature):** Design.md's module
structure lists `verifySignature(token, jwks): boolean` (synchronous). `jose`'s `jwtVerify` is
inherently async (even against an already-cached remote key set). This plan makes it
`Promise<boolean>` — a mechanical adjustment to fit the chosen library, not a reversal of any
Architecture.md decision (D3's fail-closed posture and D2's token flow are unaffected). Flagged
here for visibility; will call this out again at Plan's architecture-audit step.

**Verification:**

> Run: `yarn nx run lambda-auth:test -- jwks.spec`
> Expected: valid token accepted, tampered/wrong-key token rejected

### Step 5 — lambda-auth: `handler-none.ts` (pass-through mode)

**Changes:**

- `apps/lambda-auth/src/handler-none.ts` — unconditional pass-through, no imports beyond the
  `aws-lambda` types; must not import `@aws-sdk/client-secrets-manager` or any `lib/` module
- `apps/lambda-auth/src/handler-none.spec.ts` — asserts any request (with/without headers) returns
  the original `request` object unchanged

**Verification:**

> Run: `yarn nx run lambda-auth:test -- handler-none.spec`
> Expected: pass-through confirmed

### Step 6 — lambda-auth: `handler-basic.ts` (relocate today's handler, unchanged behavior)

**Changes:**

- `apps/lambda-auth/src/handler-basic.ts` — today's `handler.ts` content, moved verbatim (no logic
  changes)
- `apps/lambda-auth/src/handler-basic.spec.ts` — today's `handler.spec.ts` content, moved verbatim
  and re-targeted at `./handler-basic`
- Delete `apps/lambda-auth/src/handler.ts` and `handler.spec.ts` (superseded by the relocation;
  `build.ts` no longer references a fixed `handler.ts` entry point after Step 7)

**Verification:**

> Run: `yarn nx run lambda-auth:test -- handler-basic.spec`
> Expected: the same 7 cases that pass today, now against `handler-basic.ts`, with identical
> behavior (diff `handler.ts` vs `handler-basic.ts` shows no logic change, only the filename)

### Step 7 — lambda-auth: `build.ts` `AUTH_MODE` selector

**Changes:**

- `apps/lambda-auth/build.ts` — read `AUTH_MODE` from `process.env`; default to `'basic'` when
  unset; throw before any esbuild call for a value outside `{none, basic, oidc}`; select
  `entryPoints: ['src/handler-' + mode + '.ts']`; print a stdout warning
  ("⚠️ AUTH_MODE=none — this instance will have NO access control...") only when the _resolved_
  mode is `none` from an explicit `AUTH_MODE=none` (not via the unset-defaults-to-basic path, which
  can never resolve to `none` anyway so this is automatically satisfied); keep
  `external: ['@aws-sdk/client-secrets-manager']`; keep `SM_SECRET_NAME`/`AWS_REGION` `--define`
  injection for every mode
- `apps/lambda-auth/build.spec.ts` — new spec (build.ts currently has none): mocks `esbuild.build`
  to capture its call args; asserts `entryPoints` for each of `none`/`basic`/`oidc`; asserts
  unset → `basic`'s entry point with no warning; asserts an invalid value throws synchronously
  before `esbuild.build` is ever called; asserts the warning is printed to stdout for `AUTH_MODE=none`
  and not for `basic`/`oidc`/unset

**Verification:**

> Run: `yarn nx run lambda-auth:test -- build.spec`
> Expected: all mode-selection/warning/guard cases pass
>
> Run (live, authorized local build — not a guarded command, no deploy/mutation):
> `AUTH_MODE=none yarn nx run lambda-auth:build --configuration dev`
> Expected: stdout shows the warning; `apps/lambda-auth/dist/index.js` exists
>
> Run: `grep -c "jose\|SecretsManagerClient" apps/lambda-auth/dist/index.js`
> Expected: `0` — confirms AC-7 (no dead auth code in `none`-mode bundle)

### Step 8 — lambda-auth: `handler-oidc.ts` (full OIDC flow)

**Changes:**

- `apps/lambda-auth/src/handler-oidc.ts` — implements the branching flow in Design.md exactly
  (callback-path check → state validation → token exchange → finalize; else session-cookie
  presence → signature check → expiry check → pass-through or silent refresh). Reads
  `OIDC_CLIENT_ID`/`OIDC_CLIENT_SECRET`/`OIDC_TENANT_ID`/`OIDC_SESSION_SIGNING_KEY` from Secrets
  Manager at cold start (cached, mirroring `handler-basic.ts`'s `cachedHash` pattern), failing
  closed on a missing/malformed field (D6). Derives Entra endpoints from `OIDC_TENANT_ID`
  (`https://login.microsoftonline.com/{tenant}/oauth2/v2.0/{authorize,token}`, JWKS via
  `.../discovery/v2.0/keys`). Derives the callback URL from the incoming request's `Host` header
  (`https://{host}/_auth/callback`) rather than a new build-time constant, per Design.md's stated
  preference. Uses `fetch` (Node 22 built-in) for the two Entra `POST /token` calls. Calls
  `lib/pkce`, `lib/cookie`, `lib/jwks`, `lib/redirect` exclusively for their respective concerns —
  no cookie/JWT/PKCE logic duplicated here. Logs `{sub, upn, requestId: event.Records[0].cf.config.requestId}`
  to `console.log` on every request that actually reaches pass-through (Flow 2/3), satisfying D7/NFR-7.
  Calls `lib/cookie.assertByteBudget` on the signed session cookie before setting it; a thrown
  budget error is treated as a fail-closed error response (same handling as initial token-exchange
  failure), not silently truncated. Sets the session cookie under `lib/cookie`'s
  `SESSION_COOKIE_NAME` (`__Host-docs_session`) and the PKCE cookie under `PKCE_COOKIE_NAME`
  (`__Host-docs_pkce`), both `Path=/` with no `Domain` attribute (enforced implicitly by the
  `__Host-` prefix).
- `apps/lambda-auth/src/handler-oidc.spec.ts` — one test per Design.md error-handling table row:
  missing/malformed session cookie → redirect to `/authorize`; expired access + valid refresh →
  pass-through with updated `Set-Cookie`, no redirect; refresh expired/invalid → re-enters Flow 1;
  invalid JWT signature (non-expired) → fail closed to Flow 1; initial token-exchange failure
  (mocked network error/5xx/malformed) → error response, no pass-through, no retry;
  missing/malformed `OIDC_CLIENT_SECRET` at cold start → fail closed; crafted absolute/protocol-
  relative redirect target → falls back to `/`; `state` mismatch on callback → fail closed, PKCE
  cookie discarded, restarts Flow 1. Plus: cookie-attribute assertions (`HttpOnly`, `Secure`,
  `SameSite=Lax`, correct `__Host-docs_session`/`__Host-docs_pkce` name, and `Max-Age=600` on the
  PKCE cookie specifically) on every `Set-Cookie`, and the D7 attribution log line assertion.

**Implementation note (verification, per architecture-audit finding):** confirm during
implementation that `event.Records[0].cf.config.requestId` is the same value CloudFront emits as
the `x-edge-request-id` header that Architecture.md D7/HLD Auth.md describe, so the attribution
correlation claim holds as documented. If they differ, source the header value instead.

**Verification:**

> Run: `yarn nx run lambda-auth:test -- handler-oidc.spec`
> Expected: all error-handling-table rows pass, plus cookie-attribute and attribution-log assertions
>
> Run: `yarn nx run lambda-auth:typecheck`
> Expected: no errors
>
> Run (live, authorized local build): `AUTH_MODE=oidc yarn nx run lambda-auth:build --configuration dev`
> Expected: build succeeds, no stdout warning; `grep -c "jose" apps/lambda-auth/dist/index.js`
> returns a non-zero count (confirms `jose` actually bundles under esbuild's `format: cjs`,
> resolving Stack.md's flagged ESM/CJS compatibility risk — AC-3)

### Step 9 — lambda-auth: secrets/env schema docs (no code)

**Changes:**

- `apps/lambda-auth/.env.example` — add `AUTH_MODE=` line with a comment documenting
  `none|basic|oidc`, unset-defaults-to-`basic`
- `apps/lambda-auth/.secrets.example` — add `OIDC_CLIENT_ID=`, `OIDC_CLIENT_SECRET=`,
  `OIDC_TENANT_ID=`, `OIDC_SESSION_SIGNING_KEY=` lines with a comment on generating the signing key
  (e.g. `openssl rand -base64 32`)
- No changes to `scripts/local/sm-push.sh`/`sm-pull.sh` — confirmed schema-agnostic (Design.md),
  verified by reading both scripts in Plan's context-gathering

**Verification:**

> Run: `git diff apps/lambda-auth/.env.example apps/lambda-auth/.secrets.example`
> Expected: only additive lines, no secret values

### Step 10 — this repo: default to `oidc` mode with the canonical Entra app

**Changes:**

- `apps/lambda-auth/.env.dev` — set `AUTH_MODE=oidc` (this repo's deploy config only; the
  code-level migration default for _unset_ `AUTH_MODE` stays `basic` per D1 — Step 7 is unaffected)
- `apps/lambda-auth/.secrets.dev` (gitignored, already untracked — confirmed via
  `git check-ignore -v`) — set `OIDC_CLIENT_ID=3a5f31e9-f173-4f57-9caa-17cff938af2f`,
  `OIDC_TENANT_ID=e26666fd-a875-4064-b4ca-775ea917529a`, `OIDC_CLIENT_SECRET=<the canonical secret
provided by the user>`, and a freshly generated `OIDC_SESSION_SIGNING_KEY` (via
  `openssl rand -base64 32`, run locally, value never echoed into chat/commit)
- No code change ships the Collinson app's credentials anywhere in this repo

**Verification:**

> Run: `git status --short apps/lambda-auth/.secrets.dev`
> Expected: no output (file remains untracked/ignored)
>
> Run: `git log --all -p -- apps/lambda-auth/.secrets.dev` (sanity check, should already be clean)
> Expected: no history — confirms the file was never committed
>
> Run (live, authorized local build): `yarn nx run lambda-auth:build --configuration dev`
> Expected: builds `oidc` mode (reads `.env.dev`'s `AUTH_MODE=oidc` via NX `envFile`), no warning
>
> Developer-run (guarded — presented as an instruction, not executed by the agent):
> `yarn nx run lambda-auth:sm-push --configuration dev` to push `.secrets.dev` (including the new
> OIDC fields) to this environment's Secrets Manager secret, once the developer is ready to deploy

## Notes on what stays unchanged

- `apps/infra` — no CDK changes (Architecture.md confirmed: `EdgeStack`/`DocsStack` resources and
  the IAM role's `GetSecretValue` grant are unchanged; the grant is scoped to the secret ARN, not
  field names)
- `docs/Target Architecture (HLD)/...` — already published for this design; re-verified against
  the implementation in Step 8/10, no edits expected unless a real gap surfaces during Test stage
- Efforts.md Ticket #3 (security review, load test, runbook) — explicitly a pre-production gate,
  tracked in `2-report.md`'s Tech Debt table at the end of Implement, not resolved by this plan

## Addendum — Step 11 (authorized scope addition, added mid-Implement 2026-11-04)

Requested by the developer during Step 7: deploy this repo's `oidc`-mode build to the real
canonical dev environment and validate the live OIDC flow end-to-end, beyond what unit tests can
cover. This step depends on Steps 8–10 completing first (the OIDC handler, secrets schema docs,
and this repo's `.env.dev`/`.secrets.dev` configuration). All sub-actions that mutate AWS state are
guarded commands — presented as instructions for the developer to run, never executed by the agent.

### Step 11 — Deploy and validate `oidc` mode on the real dev environment (manual, guarded)

**Changes:** none (operational verification only, no code).

**Developer-run instructions:**

1. Push secrets to Secrets Manager (guarded):
   `yarn nx run lambda-auth:sm-push --configuration dev`
   (interactive confirm prompt; pushes `.secrets.dev`'s `DOCS_BASIC_AUTH_HASH` placeholder plus the
   new `OIDC_CLIENT_ID`/`OIDC_CLIENT_SECRET`/`OIDC_TENANT_ID`/`OIDC_SESSION_SIGNING_KEY` fields)
2. Build and deploy the Lambda@Edge bundle (guarded — ships to the already-provisioned placeholder
   function and triggers CloudFront propagation, per Architecture.md D1):
   `yarn nx run lambda-auth:deploy --configuration dev`
3. Wait for Lambda@Edge version propagation across CloudFront edge locations (can take several
   minutes per D1's documented rollout-consistency note) before testing.

**Verification:**

> Open `https://d2dn3olm9x55r4.cloudfront.net/` in a private/incognito browser window.
> Expected: redirected to Entra ID `/authorize` (no session cookie yet) — Flow 1.
>
> Sign in with a DataArt account.
> Expected: redirected back to the original path; page loads; DevTools → Application → Cookies
> shows `__Host-docs_session` with `HttpOnly`/`Secure`/`SameSite=Lax` set, and no leftover
> `__Host-docs_pkce` cookie (cleared on finalize).
>
> Reload the page.
> Expected: no redirect — Flow 2, steady-state pass-through.
>
> Run: `yarn nx run lambda-auth:logs --configuration dev` (tails CloudWatch) while reloading.
> Expected: a log line containing the authenticated UPN/sub and a request ID, confirming D7/NFR-7
> attribution — cross-check that request ID against the CloudFront/S3 access log for the same
> request (manual join, per D7's documented approach).
>
> Optional: manually expire/clear just the `rt`/`at` fields are not independently testable from the
> browser, so silent refresh (Flow 3) is accepted as covered by `handler-oidc.spec.ts`'s unit test
> rather than re-verified live here — flag in `2-report.md` if a live gap is found.

This is a HARD STOP verification item like every other step — the developer runs it and reports
back; the agent does not deploy or sign in on their behalf.
