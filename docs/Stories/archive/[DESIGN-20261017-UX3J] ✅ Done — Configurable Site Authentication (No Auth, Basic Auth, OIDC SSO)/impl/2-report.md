---
name: Dev Report Template
description: Template for 2-report.md — the living implementation report created by /dev context and updated throughout the dev lifecycle
type: reference
---

# DESIGN-20261017-UX3J: Configurable Site Authentication — Report

| Field  | Value                                                                                       |
| ------ | ------------------------------------------------------------------------------------------- |
| Ticket | DESIGN-20261017-UX3J                                                                        |
| Branch | `feat/design-20261017-ux3j-configurable-auth`                                               |
| PR     | —                                                                                           |
| Author | Anton Merkulov                                                                              |
| Status | ✅ Complete                                                                                 |
| Phase  | 🎯 Context ✅ · 🚀 Ceremony ✅ · 📋 Plan ✅ · 🔨 Implement ✅ · 🧪 Test ✅ · 📝 Document ✅ |

**Closure note (2026-11-04):** all 10 steps of the original approved plan are done,
tested (70/70), and documented. Step 11 — an authorized mid-Implement addendum for
live deploy/validation against the real Entra tenant — remains blocked on an
external app-registration dependency outside code scope (TD-1), with two related
follow-ups (TD-2: JWT audience validation, deferred to the pre-production security
review D2 already requires; TD-3: `requestId`/`x-edge-request-id` live equivalence
check). Developer explicitly accepted closing this ticket with these three items as
tracked follow-up debt rather than blocking archival on an unbounded external lead
time. Resume Step 11 directly from `1-plan.md`'s Addendum once Admins Helpdesk
confirms the redirect-URI registration.

**Post-archival incident (2026-11-04):** Step 11's live validation surfaced two
real-world issues Implement-stage unit tests couldn't catch, both now fixed and
confirmed against a live login against the canonical Entra tenant — see
`## Post-Archival Incident` below. TD-1 is resolved (redirect URI was registered).

## Post-Archival Incident (2026-11-04)

Once Admins Helpdesk registered the redirect URI (resolving TD-1), live sign-in
surfaced two issues neither the original Plan nor its unit tests (which mock token
responses) could have caught, because both depend on the real shape of tokens Entra
actually issues — not the shape Design.md assumed:

1. **Oversized session cookie.** Real DataArt-tenant access + refresh tokens run
   ~6.3–6.4KB combined, far exceeding the ~4093-byte limit browsers enforce on a
   single cookie's `name=value` pair (the original single-cookie design assumed a
   smaller, more typical token size). Fixed by progressive refinement: single
   oversized cookie → two-cookie split → three-cookie split (`SESSION_COOKIE_NAME`
   access-only / `REFRESH_COOKIE_NAME` refresh-only / `IDENTITY_COOKIE_NAME` claims)
   → raw (non-JSON-wrapped) token encoding + truncated 128-bit HMAC, clawing back
   the last 6–18 bytes needed to fit. See `apps/lambda-auth/src/lib/cookie.ts`'s
   module doc comment for the full before/after reasoning. Commits `b319a62`,
   `99782dc`, `866d9ba`, `cec7615`.
2. **Infinite login redirect loop ("302 ping-pong").** After the cookie-size fix,
   steady-state requests silently failed Entra signature re-verification on every
   request and bounced back to `/authorize`. Root cause: this app's access token
   (default Microsoft Graph scope, no exposed custom API) is not a reliably
   verifiable JWS — Microsoft documents that Graph-bound access tokens may be
   opaque, which real testing confirmed (`JWSSignatureVerificationFailed` on every
   attempt, not a decode error). Fixed by moving signature verification to the ID
   token (always a genuine signed JWT), done once at token issuance rather than
   per-request; steady-state now trusts the session cookie's own HMAC instead.
   Commit `001fc4c`.
3. **Second user, same CookieBudgetExceededError class, bigger overage.** After
   migrating to `openid-client` (TD-4), a _different_ DataArt user's login still hit
   `CookieBudgetExceededError` — 4328-4339 bytes against the 4093 budget, a larger
   overage than the first user ever produced. Per-user Entra access token size
   varies unpredictably (opaque Graph token format, possibly CAE-related) and isn't
   boundable by shaving encoding bytes. Root cause: the access token was stored in
   the session cookie but never actually read anywhere in `handler-oidc.ts` — pure
   dead weight that also happened to be the single largest, most variable field.
   Fixed by removing it from the session entirely (two cookies — refresh + identity
   — instead of three); `exp` is tracked independently of the token value, so D4's
   silent refresh is unaffected. Documented as a deviation from Design.md's
   `{at, rt, sub, upn, exp}` cookie contract — see `lib/cookie.ts`'s module doc
   comment. Commit `fd40e78`. See TD-5.

All three fixes are additive to the original design's intent (D2's token flow, D3's
fail-closed posture) — none reverses an Architecture.md decision. TD-4 (below)
tracks the `openid-client` migration (resolved); TD-5 tracks the access-token
removal (resolved).

## Progress

| #   | Step                                                | Status  | Notes                                                                                                                                | Test | Docs |
| --- | --------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---- | ---- |
| 1   | `lib/redirect.ts` — open-redirect guard             | ✅ Done | Straightforward, went as planned                                                                                                     | ✅   | —    |
| 2   | `lib/pkce.ts` — PKCE/state generation               | ✅ Done | Went as planned                                                                                                                      | ✅   | —    |
| 3   | `lib/cookie.ts` — session/PKCE cookie sign/verify   | ✅ Done | Added `clearPkceCookie` helper                                                                                                       | ✅   | —    |
| 4   | `lib/jwks.ts` — JWKS fetch/cache + verify (`jose`)  | ✅ Done | `jose@^6.0.0`, clockTolerance=10y                                                                                                    | ✅   | —    |
| 5   | `handler-none.ts` — pass-through                    | ✅ Done | Went as planned                                                                                                                      | ✅   | —    |
| 6   | `handler-basic.ts` — relocate today's handler       | ✅ Done | Verbatim, confirmed via diff                                                                                                         | ✅   | —    |
| 7   | `build.ts` — `AUTH_MODE` selector                   | ✅ Done | Live build + bundle check verified                                                                                                   | ✅   | —    |
| 8   | `handler-oidc.ts` — full OIDC flow                  | ✅ Done | Diverged from plan text on silent-refresh mechanics — see notes                                                                      | ✅   | —    |
| 9   | `.env.example`/`.secrets.example` — schema docs     | ✅ Done | Additive-only, no secrets; sm-push/pull unchanged                                                                                    | —    | ✅   |
| 10  | This repo — default to `oidc` with canonical app    | ✅ Done | Real build verified; stray stale artifact identified, not ours                                                                       | ✅   | —    |
| 11  | Deploy + validate `oidc` on real dev env (addendum) | ✅ Done | Unblocked once Entra redirect-URI registered; live login confirmed after fixing two further issues — see `## Post-Archival Incident` | ✅   | —    |

## Stage Metrics

<!-- dev-metrics-stage:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the stage's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the stage. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. **Flags** surfaces non-initial attempt triggers (🔁 retried/rework, 🔀 scope change, 🔓 reopened) and any failed check (⚠️), derived from recorded data — never a new judgment call — so a reader can scan for problem stages without parsing every row. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 1h 15m 40s · Wait: 0s · Unclassified: 16m 52s

| Stage     | Started (UTC)            | Completed (UTC)          | Elapsed     | Work    | Wait | Input tokens | Output tokens | Coverage            | Attempts | Failed checks | Flags |
| --------- | ------------------------ | ------------------------ | ----------- | ------- | ---- | ------------ | ------------- | ------------------- | -------- | ------------- | ----- |
| context   | 2026-11-03T22:58:04.953Z | 2026-11-03T22:58:07.997Z | 3s          | 3s      | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| ceremony  | 2026-11-03T22:58:59.189Z | 2026-11-03T22:58:59.238Z | 0s          | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| plan      | 2026-11-03T22:58:59.299Z | 2026-11-03T23:16:52.601Z | 17m 53s     | 17m 53s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| implement | 2026-11-03T23:16:52.649Z | unavailable              | unavailable | 57m 44s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| test      | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             | —     |
| document  | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             | —     |

Quality (recorded inventory): findings 16 · open 0 · PR findings 5 · critical 0 · debt 3 · tests written 63 · latest failed cases 0 · failed test runs 0. Counts describe recorded coverage, not a quality score; kind/severity/resolution breakdowns are in [stat.json](stat.json).
<!-- dev-metrics-stage:end -->

## Step Metrics

<!-- dev-metrics-step:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the step's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the step. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. **Flags** surfaces non-initial attempt triggers (🔁 retried/rework, 🔀 scope change, 🔓 reopened) and any failed check (⚠️), derived from recorded data — never a new judgment call — so a reader can scan for problem steps without parsing every row. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 1h 15m 40s · Wait: 0s · Unclassified: 16m 52s

| Step                                                       | Started (UTC)            | Completed (UTC)          | Elapsed     | Work    | Wait | Input tokens | Output tokens | Coverage            | Attempts | Failed checks | Flags |
| ---------------------------------------------------------- | ------------------------ | ------------------------ | ----------- | ------- | ---- | ------------ | ------------- | ------------------- | -------- | ------------- | ----- |
| step-01: Step 1                                            | 2026-11-03T23:18:36.095Z | 2026-11-03T23:20:39.480Z | 2m 3s       | 2m 3s   | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-02: Step 2                                            | 2026-11-03T23:23:29.916Z | 2026-11-03T23:24:37.587Z | 1m 8s       | 1m 8s   | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-03: Step 3                                            | 2026-11-03T23:27:27.129Z | 2026-11-03T23:29:34.867Z | 2m 8s       | 2m 8s   | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-04: Step 4                                            | 2026-11-03T23:30:22.301Z | 2026-11-03T23:32:37.719Z | 2m 15s      | 2m 15s  | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-05: Step 5                                            | 2026-11-03T23:34:50.752Z | 2026-11-03T23:37:00.289Z | 2m 10s      | 2m 10s  | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-06: Step 6                                            | 2026-11-03T23:38:37.369Z | 2026-11-03T23:41:13.724Z | 2m 36s      | 2m 36s  | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-07: Step 7                                            | 2026-11-03T23:41:58.191Z | 2026-11-03T23:44:36.078Z | 2m 38s      | 2m 38s  | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-08: Step 8                                            | 2026-11-03T23:46:18.738Z | 2026-11-03T23:56:50.260Z | 10m 32s     | 10m 32s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-09: Step 9                                            | 2026-11-03T23:58:39.481Z | 2026-11-04T00:01:07.885Z | 2m 28s      | 2m 28s  | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-10: Step 10                                           | 2026-11-04T00:01:32.757Z | 2026-11-04T00:07:40.097Z | 6m 7s       | 6m 7s   | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-11: Deploy + validate oidc on real dev env (addendum) | 2026-11-04T00:08:42.468Z | unavailable              | unavailable | 21m 55s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |

<!-- dev-metrics-step:end -->

## Review Findings

| ID    | Stage    | Origin          | Kind      | Deviation type | Severity | Classification | Finding                                                                                                                                                                                                                                                                                     | Evidence                            | Resolution | TD   | Decision                                                                                                                                                                                                             |
| ----- | -------- | --------------- | --------- | -------------- | -------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-1  | plan     | hld-audit       | deviation | omission       | high     | introduced     | Plan omitted Design.md's exact cookie names (`__Host-docs_session`/`__Host-docs_pkce`), `Path=/`/no-`Domain`, PKCE 10-min TTL                                                                                                                                                               | `1-plan.md` Step 3/8 (pre-rework)   | fixed      | —    | Reworked Step 3/8 + added AC-10; re-audit verdict **go**                                                                                                                                                             |
| RF-2  | plan     | hld-audit       | design    | —              | low      | advisory       | `cf.config.requestId` vs `x-edge-request-id` header equivalence for D7/NFR-7 not confirmed                                                                                                                                                                                                  | `1-plan.md` Step 8                  | tech-debt  | TD-3 | Cannot be confirmed without a live deployed CloudFront distribution/CloudWatch logs — same category of unavailable live-AWS verification as TD-1/TD-2. See TD-3                                                      |
| RF-3  | plan     | hld-audit       | design    | —              | low      | advisory       | `jose` `clockTolerance` could misroute an expired-but-validly-signed token into fail-closed instead of silent refresh                                                                                                                                                                       | Re-audit report                     | fixed      | —    | Added `lib/jwks.spec.ts` test confirming an expired-but-validly-signed token is still accepted by `verifySignature` (Document stage)                                                                                 |
| RF-4  | plan     | doc-consistency | docs      | —              | info     | pre-existing   | `solution/Design.md`'s module diagram shows `HB --> COOKIE`, contradicting its own prose that `handler-basic.ts` uses no `lib/` module                                                                                                                                                      | Both audit reports                  | fixed      | —    | Removed the stray `HB --> COOKIE` edge from `solution/Design.md`'s diagram (Document stage)                                                                                                                          |
| RF-5  | test     | pr-review       | security  | —              | high     | introduced     | `sanitizeRedirectTarget` didn't reject embedded CR/LF/NUL, allowing header/response-splitting via the attacker-controlled `state` suffix                                                                                                                                                    | `@auth` review                      | fixed      | —    | Added control-character rejection in `lib/redirect.ts`; new CRLF/NUL test cases added and passing                                                                                                                    |
| RF-6  | test     | pr-review       | bug       | —              | medium   | introduced     | `signPkceCookie` never called `assertByteBudget`, unlike `signSessionCookie` — unenforced Design.md D3 contract                                                                                                                                                                             | `@auth` review                      | fixed      | —    | Added budget check + test to `signPkceCookie`                                                                                                                                                                        |
| RF-7  | test     | pr-review       | improve   | —              | low      | introduced     | Byte-budget check measured only the signed token, not the full `Set-Cookie` header (~55 extra bytes from attributes)                                                                                                                                                                        | `@auth` review                      | fixed      | —    | Both sign functions now assert on the full `Set-Cookie` string                                                                                                                                                       |
| RF-8  | test     | hld-audit       | security  | —              | high     | introduced     | `jwtVerify` validated signature only — no `aud`/`iss` check, so any token signed by the tenant's keys for _any_ app in that tenant would pass                                                                                                                                               | `@auth` + `@architect` reviews      | tech-debt  | TD-2 | Added `issuer` validation (deterministic, tenant-scoped). `audience` validation deferred — depends on live Entra app config not verifiable here; see TD-2                                                            |
| RF-9  | test     | hld-audit       | docs      | —              | info     | introduced     | `lib/cookie.ts`'s `__Host-` prefix comment cited D5 instead of D3                                                                                                                                                                                                                           | `@architect` review                 | fixed      | —    | Comment corrected                                                                                                                                                                                                    |
| RF-10 | test     | pr-review       | security  | —              | medium   | introduced     | Steady-state pass-through forwarded the `Cookie` header (raw access/refresh tokens) to the S3 origin unmodified                                                                                                                                                                             | `@auth` review                      | fixed      | —    | `handler-oidc.ts` now strips the `Cookie` header before forwarding; test added                                                                                                                                       |
| RF-11 | test     | pr-review       | improve   | —              | info     | introduced     | Local variable `expectedStatePart` actually held the _received_ (attacker-visible) value, backwards from `validateState(expected, received)`'s own parameter names                                                                                                                          | `@auth` review                      | fixed      | —    | Renamed to `receivedStatePart`                                                                                                                                                                                       |
| RF-12 | test     | hld-audit       | design    | —              | low      | pre-existing   | Architecture.md's "Open items for Solution follow-through" lists an unresolved JWKS/secret cache TTL policy; code ships cold-start-only caching with no explicit closing decision                                                                                                           | `@architect` review                 | accepted   | —    | Design.md's own lib/jwks.ts section already specifies "fetch once per cold start, no TTL" as the deliberate decision — this closes the Architecture.md open item; noted here for traceability, no code change needed |
| RF-13 | document | doc-consistency | docs      | —              | medium   | introduced     | New LLD doc's silent-refresh description/diagram implied same-response pass-through, not the actual redirect-based mechanism                                                                                                                                                                | `@architect` doc-consistency review | fixed      | —    | Corrected prose + diagram in `Auth/00. Overview.md`                                                                                                                                                                  |
| RF-14 | document | doc-consistency | docs      | —              | low      | introduced     | New LLD doc's diagram omitted the `errorResponse()` 502 terminal state (SM/token-exchange failure, cookie-budget overflow)                                                                                                                                                                  | `@architect` doc-consistency review | fixed      | —    | Added `ERR` node + edge to the diagram, plus a Key Decisions bullet                                                                                                                                                  |
| RF-15 | document | doc-consistency | docs      | —              | info     | introduced     | New LLD doc's IAM-policy bullet included a rationale clause, violating the certainty principle (LLD = settled outcomes only)                                                                                                                                                                | `@architect` doc-consistency review | fixed      | —    | Rationale clause removed, outcome-only statement kept                                                                                                                                                                |
| RF-16 | document | doc-consistency | docs      | —              | medium   | pre-existing   | Published HLD `Auth.md`'s Flow 3 sequence diagram shows `pass-through + Set-Cookie` as one step — doesn't match the actual redirect-based silent-refresh mechanism (pre-existing from this design's original Publish stage, before the redirect constraint was discovered during Implement) | `@architect` doc-consistency review | fixed      | —    | Corrected HLD Flow 3 diagram to show the 302-redirect-then-pass-through sequence                                                                                                                                     |

## Implementation Notes

### Step 1 — `lib/redirect.ts`

Went as planned. 8/8 tests pass (`yarn nx run lambda-auth:test -- redirect.spec`).

### Step 2 — `lib/pkce.ts`

Went as planned. 6/6 tests pass (`yarn nx run lambda-auth:test -- pkce.spec`).

### Step 3 — `lib/cookie.ts`

Went as planned. Added one small export beyond Design.md's explicit list:
`clearPkceCookie()` (a `Set-Cookie` with `Max-Age=0`) — needed by `handler-oidc.ts`'s
Finalize step, which the design flowchart already specifies ("clears PKCE cookie"),
so this is implementing an already-approved behavior, not new scope. 13/13 tests pass
(`yarn nx run lambda-auth:test -- cookie.spec`).

### Step 4 — `lib/jwks.ts`

Added `jose@^6.0.0` (Stack.md specified `^5.x` as "latest stable at implementation
time" — 6.x is now current, so used that). `verifySignature`'s parameter type is
`jose.JWTVerifyGetKey` rather than the literal `ReturnType<typeof createRemoteJWKSet>`
so a local JWKS fixture type-checks in tests — same functional shape. Per the
Plan-stage re-audit's RF-3 finding, set `clockTolerance` to 10 years inside
`verifySignature`, fully delegating expiry branching to `handler-oidc.ts`'s own
`exp` check rather than letting `jose` ever fail signature verification on an
expired-but-validly-signed token. 5/5 tests pass, typecheck clean.

### Step 5 — `handler-none.ts`

Went as planned. 3/3 tests pass (`yarn nx run lambda-auth:test -- handler-none.spec`).

### Step 6 — `handler-basic.ts`

Went as planned. Relocated `handler.ts`/`handler.spec.ts` to `handler-basic.ts`/
`handler-basic.spec.ts` (filesystem move, unstaged — developer stages/commits).
Content confirmed byte-identical via `diff` except the spec's import path.
7/7 tests pass (`yarn nx run lambda-auth:test -- handler-basic.spec`).

### Step 7 — `build.ts`

Refactored `build.ts` to export `resolveAuthMode()` for testability (module still
runs as a plain script, unchanged CLI behavior). 9/9 `build.spec` tests pass; full
project suite 51/51 pass; typecheck clean. Live-verified: `AUTH_MODE=none` build
prints the warning and produces a bundle with zero `jose`/`SecretsManagerClient`
occurrences (AC-7); `AUTH_MODE=bogus` throws before esbuild runs, no `dist/index.js`
written (AC-4). Cleaned up local test-build artifacts afterward (gitignored, not committed).

### Step 8 — `handler-oidc.ts`

Implemented the full branching flow (callback/token-exchange, steady-state, silent
refresh, fail-closed paths) per Design.md, using all four `lib/` modules exclusively
for their respective concerns. 13/13 `handler-oidc.spec` tests pass (one per
Design.md error-handling-table row, plus cookie-attribute/name/TTL and attribution
log assertions); full suite 64/64 pass; typecheck clean. Live-verified `AUTH_MODE=oidc`
build: no warning, `jose` confirmed bundled (22 references, 1151-line output) —
resolves Stack.md's flagged ESM/CJS compatibility risk.

**Divergence from the plan's literal wording (developer-confirmed acceptable):**
Design.md/Architecture.md describe silent refresh (Flow 3) as "pass-through +
Set-Cookie." A single CloudFront **viewer-request** Lambda@Edge trigger (the only
association `apps/infra` provisions) cannot both attach a browser-visible Set-Cookie
and forward the request to S3 in one response — it can only do one or the other.
Implemented instead as an instant 302 redirect to the same URI with the refreshed
session cookie, which immediately re-requests the page and then hits the
steady-state pass-through branch — transparent to the user, satisfying D4's "no
visible re-login" intent via one extra round trip rather than a literal
same-response pass-through. No D1–D10 decision or `apps/infra` resource is affected.

### Step 9 — secrets/env schema docs

Went as planned. `.env.example` documents `AUTH_MODE`; `.secrets.example` documents
`OIDC_CLIENT_ID`/`OIDC_CLIENT_SECRET`/`OIDC_TENANT_ID`/`OIDC_SESSION_SIGNING_KEY` with
generation hints. `sm-push.sh`/`sm-pull.sh` re-read and confirmed schema-agnostic —
no script changes needed, as Design.md anticipated.

### Step 10 — default this repo to `oidc`

Set `apps/lambda-auth/.env.dev`'s `AUTH_MODE=oidc` and populated `.secrets.dev` with
the canonical app's `OIDC_CLIENT_ID`/`OIDC_TENANT_ID`/`OIDC_CLIENT_SECRET` plus a
freshly generated `OIDC_SESSION_SIGNING_KEY` (`openssl rand -base64 32`) — both files
confirmed gitignored (`.env.*`/`.secrets.*` patterns), never committed, no secret
value found anywhere in `git grep`. client's credentials are not used in this repo.

The developer ran `yarn nx run lambda-auth:build:dev` directly and flagged that
`dist/lambda-handler.js` showed basic-auth content — investigated: that file is a
stale artifact dated Jul 15, predating this entire ticket, and is not written by any
current build target (`build.ts` always outputs `dist/index.js`, zipped to
`lambda-auth.zip`). The actual build output (`dist/index.js`) was confirmed correct —
23 matches for `handler-oidc`/`login.microsoftonline`/`jose`. Developer opted to
leave the stale file as-is (harmless, gitignored, unused).

### Step 11 — Deploy + validate `oidc` on real dev env (addendum)

Developer ran `sm-push`/`deploy` against the real dev environment. Live sign-in
against `https://d2dn3olm9x55r4.cloudfront.net/_auth/callback` returned
`AADSTS500113: No reply address is registered for the application`. Verified the
IAM access policy first (`apps/infra/lib/edge-stack.ts`'s `AuthFnRole` already
grants `secretsmanager:GetSecretValue` scoped to the exact secret ARN — unchanged,
confirmed correct, not the cause) and the code's `redirect_uri` construction
(`handler-oidc.ts`'s `CALLBACK_PATH` correctly produces
`https://d2dn3olm9x55r4.cloudfront.net/_auth/callback` from the request's `Host`
header) — both confirmed correct. The error is specifically Entra rejecting a
`redirect_uri` that doesn't match a registered one on the app registration itself —
the external, manual D8 dependency (Admins Helpdesk-owned app registration).
Developer is emailing Admins Helpdesk to confirm the URI is registered under the
**Web** platform (not SPA — a common cause of this exact error for a confidential-
client flow). Logged as TD-1; Step 11 marked ⚠️ Blocked, not failed — all code-level
steps (1–10, the original approved plan) are complete and verified independent of
this external dependency.

## Tech Debt

| #    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Type        | Tracker | Finding | Owner                                     | Next action                                                                                                                                                                                                                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------- | ------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TD-1 | ~~Step 11 (deploy + validate on real dev env) is blocked: live sign-in against `https://d2dn3olm9x55r4.cloudfront.net/_auth/callback` returns `AADSTS500113: No reply address is registered for the application`.~~ **Resolved 2026-11-04** — Admins Helpdesk registered the redirect URI (Web platform). Live sign-in confirmed working end-to-end, after fixing two further issues the registration unblocked (see `## Post-Archival Incident` above).                                                                                                                                                                                                                                          | blocker     | —       | —       | Admins Helpdesk                           | Closed.                                                                                                                                                                                                                                                                                                  |
| TD-2 | ~~`lib/jwks.ts`'s `verifySignature` validates signature + issuer of the **ID token**, but not `aud`.~~ **Resolved 2026-11-04** — superseded by TD-4's `openid-client` migration (commit `6e783be`), which validates `aud` on the ID token by default.                                                                                                                                                                                                                                                                                                                                                                                                                                             | security    | —       | RF-8    | Developer / independent security reviewer | Closed.                                                                                                                                                                                                                                                                                                  |
| TD-3 | D7/NFR-7 attribution logs `event.Records[0].cf.config.requestId`, intended to correlate with CloudFront's `x-edge-request-id` header in access logs — the two values' equivalence hasn't been confirmed against a live deployed distribution.                                                                                                                                                                                                                                                                                                                                                                                                                                                     | dependency  | —       | RF-2    | Developer                                 | During Step 11's live validation (once unblocked), compare a logged `requestId` against the corresponding CloudFront/S3 access-log entry's `x-edge-request-id` for the same request. If they differ, source the header value in `handler-oidc.ts` instead.                                               |
| TD-4 | ~~`handler-oidc.ts`/`lib/{pkce,jwks}.ts` hand-roll the authorization-code+PKCE flow, state/nonce validation, token exchange/refresh, and JWKS-based verification with raw `fetch` calls.~~ **Resolved 2026-11-04** — migrated to `openid-client` (commit `6e783be`). `lib/pkce.ts` and `lib/jwks.ts` removed; PKCE generation, state validation, token exchange/refresh, and ID-token signature/issuer/audience verification are now all owned by the library. 64/64 tests pass; bundle verified smaller (15.8KB zipped) with no `jose`/raw-fetch token code remaining.                                                                                                                           | enhancement | —       | —       | Developer                                 | Closed.                                                                                                                                                                                                                                                                                                  |
| TD-5 | A second real login (different DataArt user) hit a new `CookieBudgetExceededError` the three-cookie split still didn't cover (4328-4339 bytes vs. the 4093 budget — a bigger overage than the first user's token). Root cause: the access token, which was stored but never read anywhere in the handler, was also the single largest and most per-user-variable field. **Resolved 2026-11-04** — removed the access token from the session cookie entirely (commit `fd40e78`); session is now two cookies (refresh token + identity) instead of three. Documented as a deviation from Design.md's original `{at, rt, sub, upn, exp}` cookie contract — see `lib/cookie.ts`'s module doc comment. | bug         | —       | —       | Developer                                 | Closed. Separately: confirm with the client whether work-email-address identity claims (`sub`/`upn`, still stored in the identity cookie) need handling beyond signed/`HttpOnly`/`Secure` cookie storage — a policy question for the independent security review (Efforts.md Ticket #3), not a code gap. |

## Test Results

| Project     | Build | Tests | Typecheck | Lint | Written | Passed | Failed | Skipped | Evidence                                                                                                                                            |
| ----------- | ----- | ----- | --------- | ---- | ------- | ------ | ------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| lambda-auth | ✅    | ✅    | ✅        | ✅   | 63      | 70     | 0      | 0       | `yarn nx run lambda-auth:{build,test,typecheck,lint}` (all green); live `oidc`/`none`/`bogus` `AUTH_MODE` builds verified manually (Steps 7, 8, 10) |

## Acceptance Criteria Validation

_Per `1-plan.md`'s Acceptance Criteria (immutable; results recorded here, not by editing the plan)._

| AC    | Result  | Evidence                                                                                                     |
| ----- | ------- | ------------------------------------------------------------------------------------------------------------ |
| AC-1  | ✅ Pass | `build.spec.ts` unit-covers unset→`basic`; live default-mode build before Step 10 confirmed no warning       |
| AC-2  | ✅ Pass | Live `AUTH_MODE=none` build (Step 7): warning printed, `handler-none.ts` selected                            |
| AC-3  | ✅ Pass | Live `AUTH_MODE=oidc` build (Steps 8, 10): no warning, `jose` confirmed bundled                              |
| AC-4  | ✅ Pass | Live `AUTH_MODE=bogus` build (Step 7): exit 1 before esbuild, no `dist/index.js`                             |
| AC-5  | ✅ Pass | 69/69 tests pass, covering every row of Design.md's error-handling table + all lib modules + build selection |
| AC-6  | ✅ Pass | `yarn nx run lambda-auth:typecheck` clean throughout                                                         |
| AC-7  | ✅ Pass | `none`-mode bundle grep: 0 matches for `jose`/`SecretsManagerClient` (Step 7)                                |
| AC-8  | ✅ Pass | `.env.dev`/`.secrets.dev` populated with canonical app credentials + generated signing key (Step 10)         |
| AC-9  | ✅ Pass | `git grep` for both secret values across the repo: no matches (Step 10)                                      |
| AC-10 | ✅ Pass | `handler-oidc.spec.ts`'s cookie-attribute test asserts exact names + `Max-Age=600`                           |

All 10 acceptance criteria pass. Step 11 (live end-to-end sign-in against the real
Entra tenant) remains open per TD-1 — not one of the original plan's ACs, but the
addendum's own intended verification; unaffected by the AC-level pass above.

## Documentation

_Date: 2026-11-04_

| Item                                                                        | Action                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `docs/Target Architecture (HLD)/v1/Containers/Auth.md`                      | No change needed — already published at the design's Publish stage; current and accurate               |
| `docs/Target Architecture (HLD)/v1/Non-Functional Concerns/Requirements.md` | No change needed — already published at the design's Publish stage                                     |
| `docs/System Architecture (LLD)/Auth/00. Overview.md`                       | Updated — full rewrite for the three-mode `AUTH_MODE` implementation (was stale, single-mode)          |
| `docs/Target Architecture (HLD)/v1/Containers/Auth.md` (Flow 3 diagram)     | Updated — corrected to show the actual redirect-based silent-refresh mechanism (RF-16)                 |
| `apps/lambda-auth/.env.example` / `.secrets.example`                        | Updated in Step 9 (Implement) — `AUTH_MODE`/`OIDC_*` fields documented                                 |
| `apps/lambda-auth` app README                                               | No change needed — none exists; env var documentation lives in `.env.example`/`.secrets.example` (DRY) |

### Notes

HLD deviation audit (Document Step 1) was satisfied by the Test-stage `@architect`
audit, which already compared the full implementation against `Auth.md`/NFR-1/6/7/8
in detail (16-row alignment table, RF-8/9/12 raised and resolved there) — re-running
it here would have been redundant. The consistency review (`@architect`, Step 3)
found 3 real issues in the new LLD rewrite plus 1 pre-existing HLD inaccuracy; all 4
fixed (RF-13 through RF-16).

## Efforts Spent

| Date       | Phase            | Human time  | AI tokens   | Notes                                                                                                    |
| ---------- | ---------------- | ----------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| 2026-11-04 | Context–Document | unavailable | unavailable | Full `AUTH_MODE` (`none`/`basic`/`oidc`) implementation per approved design; Step 11 deferred (TD-1/2/3) |
