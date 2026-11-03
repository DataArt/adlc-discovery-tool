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
| Status | 🔄 In Progress                                                                              |
| Phase  | 🎯 Context ✅ · 🚀 Ceremony ✅ · 📋 Plan ✅ · 🔨 Implement 🔄 · 🧪 Test ⏳ · 📝 Document ⏳ |

## Progress

| #   | Step                                                | Status     | Notes                                                           | Test | Docs |
| --- | --------------------------------------------------- | ---------- | --------------------------------------------------------------- | ---- | ---- |
| 1   | `lib/redirect.ts` — open-redirect guard             | ✅ Done    | Straightforward, went as planned                                |      |      |
| 2   | `lib/pkce.ts` — PKCE/state generation               | ✅ Done    | Went as planned                                                 |      |      |
| 3   | `lib/cookie.ts` — session/PKCE cookie sign/verify   | ✅ Done    | Added `clearPkceCookie` helper                                  |      |      |
| 4   | `lib/jwks.ts` — JWKS fetch/cache + verify (`jose`)  | ✅ Done    | `jose@^6.0.0`, clockTolerance=10y                               |      |      |
| 5   | `handler-none.ts` — pass-through                    | ✅ Done    | Went as planned                                                 |      |      |
| 6   | `handler-basic.ts` — relocate today's handler       | ✅ Done    | Verbatim, confirmed via diff                                    |      |      |
| 7   | `build.ts` — `AUTH_MODE` selector                   | ✅ Done    | Live build + bundle check verified                              |      |      |
| 8   | `handler-oidc.ts` — full OIDC flow                  | ✅ Done    | Diverged from plan text on silent-refresh mechanics — see notes |      |      |
| 9   | `.env.example`/`.secrets.example` — schema docs     | ⏳ Pending |                                                                 |      |      |
| 10  | This repo — default to `oidc` with canonical app    | ⏳ Pending |                                                                 |      |      |
| 11  | Deploy + validate `oidc` on real dev env (addendum) | ⏳ Pending | Scope added mid-Implement 2026-11-04, see `1-plan.md` Addendum  |      |      |

## Stage Metrics

<!-- dev-metrics-stage:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the stage's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the stage. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. **Flags** surfaces non-initial attempt triggers (🔁 retried/rework, 🔀 scope change, 🔓 reopened) and any failed check (⚠️), derived from recorded data — never a new judgment call — so a reader can scan for problem stages without parsing every row. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 45m 9s · Wait: 0s · Unclassified: 13m 56s

| Stage     | Started (UTC)            | Completed (UTC)          | Elapsed     | Work    | Wait | Input tokens | Output tokens | Coverage            | Attempts | Failed checks | Flags |
| --------- | ------------------------ | ------------------------ | ----------- | ------- | ---- | ------------ | ------------- | ------------------- | -------- | ------------- | ----- |
| context   | 2026-11-03T22:58:04.953Z | 2026-11-03T22:58:07.997Z | 3s          | 3s      | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| ceremony  | 2026-11-03T22:58:59.189Z | 2026-11-03T22:58:59.238Z | 0s          | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| plan      | 2026-11-03T22:58:59.299Z | 2026-11-03T23:16:52.601Z | 17m 53s     | 17m 53s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| implement | 2026-11-03T23:16:52.649Z | unavailable              | unavailable | 27m 13s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| test      | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             | —     |
| document  | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             | —     |

Quality (recorded inventory): findings 4 · open 3 · PR findings 0 · critical 0 · debt 0 · tests written unavailable · latest failed cases unavailable · failed test runs 0. Counts describe recorded coverage, not a quality score; kind/severity/resolution breakdowns are in [stat.json](stat.json).
<!-- dev-metrics-stage:end -->

## Step Metrics

<!-- dev-metrics-step:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the step's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the step. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. **Flags** surfaces non-initial attempt triggers (🔁 retried/rework, 🔀 scope change, 🔓 reopened) and any failed check (⚠️), derived from recorded data — never a new judgment call — so a reader can scan for problem steps without parsing every row. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 45m 9s · Wait: 0s · Unclassified: 13m 56s

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
| step-09: Step 9                                            | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             | —     |
| step-10: Step 10                                           | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             | —     |
| step-11: Deploy + validate oidc on real dev env (addendum) | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             | —     |

<!-- dev-metrics-step:end -->

## Review Findings

| ID   | Stage | Origin          | Kind      | Deviation type | Severity | Classification | Finding                                                                                                                                | Evidence                          | Resolution | TD  | Decision                                                                                                |
| ---- | ----- | --------------- | --------- | -------------- | -------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------- | --- | ------------------------------------------------------------------------------------------------------- |
| RF-1 | plan  | hld-audit       | deviation | omission       | high     | introduced     | Plan omitted Design.md's exact cookie names (`__Host-docs_session`/`__Host-docs_pkce`), `Path=/`/no-`Domain`, PKCE 10-min TTL          | `1-plan.md` Step 3/8 (pre-rework) | fixed      | —   | Reworked Step 3/8 + added AC-10; re-audit verdict **go**                                                |
| RF-2 | plan  | hld-audit       | design    | —              | low      | advisory       | `cf.config.requestId` vs `x-edge-request-id` header equivalence for D7/NFR-7 not confirmed                                             | `1-plan.md` Step 8                | open       | —   | Added implementation note to confirm equivalence during Implement; fallback to header if different      |
| RF-3 | plan  | hld-audit       | design    | —              | low      | advisory       | `jose` `clockTolerance` could misroute an expired-but-validly-signed token into fail-closed instead of silent refresh                  | Re-audit report                   | open       | —   | Not a plan change; add a dedicated test case in Step 8's `handler-oidc.spec.ts` during Implement        |
| RF-4 | plan  | doc-consistency | docs      | —              | info     | pre-existing   | `solution/Design.md`'s module diagram shows `HB --> COOKIE`, contradicting its own prose that `handler-basic.ts` uses no `lib/` module | Both audit reports                | open       | —   | Not a plan defect (plan correctly follows the prose); flag to Design.md owner separately — out of scope |

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

## Tech Debt

| #   | Description | Type | Tracker | Finding | Owner | Next action |
| --- | ----------- | ---- | ------- | ------- | ----- | ----------- |

## Test Results

| Project | Build | Tests | Typecheck | Lint | Written | Passed | Failed | Skipped | Evidence |
| ------- | ----- | ----- | --------- | ---- | ------- | ------ | ------ | ------- | -------- |

## Efforts Spent

| Date | Phase | Human time | AI tokens | Notes |
| ---- | ----- | ---------- | --------- | ----- |
