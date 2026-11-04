---
name: Design Report Template
description: Template for design/Report.md — the living design report, idempotency anchor, and WAF findings store
type: reference
---

# Design Report — DESIGN-20261017-UX3J: Configurable Site Authentication (No Auth / Basic Auth / OIDC SSO)

## Context

_Resolved once in Frame, via `patterns/context-resolution.md`. Every later phase reads these values instead of re-resolving them — as `{source docs}` / `{dest docs}` / `{resolved architect agent}`._

| Field               | Value                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Track               | Project                                                                                                                                |
| Source docs         | `docs/Target Architecture (HLD)/`                                                                                                      |
| Dest docs           | `docs/Target Architecture (HLD)/v1/Containers/`                                                                                        |
| Subfolder           | `v1/Containers` (target doc: `Auth.md`)                                                                                                |
| Architect agent     | `@architect`                                                                                                                           |
| Implementation note | Project design covering this repo's own containers (`apps/lambda-auth`, `apps/infra`) — `/dev` in this repo is the expected next step. |

## State

```yaml
current_stage: publish
completed_stages: [frame, research, evaluate, solution, review-gate, address-feedback]
selected_artifacts: [architecture, design, stack, efforts]
next_action: 'Begin Publish'
context_fingerprint: ''
```

Update this block whenever a phase starts, completes, or is invalidated. The
`selected_artifacts` values are interface names (`architecture`, `design`, `stack`,
`efforts`) and are the source of truth for downstream review, publish, and resume.

## Evidence

| Source                                                  | Read at stage | Relevant decision or constraint                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Reference/version                     |
| ------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| BSIMM review (Dmitry Vyrostkov, 2026-10-15)             | Frame         | No SSO — single shared Basic Auth password, no per-user identity/attribution/revocation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Supervisor comment, 15 Oct 2026 21:26 |
| BSIMM review (Dmitry Vyrostkov, 2026-10-15)             | Frame         | No password policy — any value accepted as the shared Basic Auth password                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Supervisor comment, 15 Oct 2026 21:26 |
| `apps/lambda-auth/src/handler.ts`                       | Frame         | Current Basic Auth implementation — Lambda@Edge viewer-request function                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Repo, as of 2026-10-17                |
| Solution concern scan (`interfaces/INTENT.md`)          | Solution      | Material: boundaries/ownership (per-mode CDK build selection), data/state (session cookie + Secrets Manager payload), interfaces (OIDC callback route/PKCE), security (token handling), reliability (refresh flow, JWKS cache TTL), performance (edge token-exchange latency — WAF P2), operations (build tooling, NFR-7 attribution), evolution (migration default for existing instances). Informational: cost (already settled Green in WAF). Not applicable: compliance/residency — no regulatory driver raised for this engagement. Selected interfaces: architecture, design, stack, efforts (all four apply — boundaries, behavior/contracts, stack, and implementation slices all change).                                              | design/Report.md, 2026-10-17          |
| Developer specification session                         | Solution      | Migration default: existing deployed instances default to `basic` mode if `authMode` is left unset on next deploy — no behavior change without an explicit opt-in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Developer confirmation, 2026-10-17    |
| Developer specification session                         | Solution      | NFR-7 attribution (OQ-2): correlate via CloudWatch execution logs — Lambda@Edge logs the authenticated principal alongside CloudFront's `x-edge-request-id`, joined manually to the CloudFront/S3 access-log entry for the same request; no new infrastructure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Developer confirmation, 2026-10-17    |
| Design quality gate (`patterns/design-quality-gate.md`) | Solution      | PASS, after remediation — all 6 checks passed. One gap found and closed: two Frame-accepted proposed ECs (20+ char passphrase policy for `basic` mode; non-production-safe warning for `none` mode) had no corresponding decision in Architecture.md — added as D9/D10 and propagated to Design.md/Efforts.md. No Mermaid CLI available in this repo; ran a syntax-oriented inspection instead of automated rendering (two real syntax errors already caught and fixed interactively during drafting: a semicolon inside a sequenceDiagram message, and `call` as a reserved-keyword classDef name). All relative links verified to resolve (`[stat.json](stat.json)` in this file; all other file references are prose code-spans, not links). | design/Report.md, 2026-10-17          |

## Status

| Field  | Value                                                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Ticket | DESIGN-20261017-UX3J                                                                                                            |
| Status | ✅ Complete — 1h 19m observed work (design/stat.json)                                                                           |
| Phase  | 📋 Frame ✅ · 🔍 Research ✅ · 🏗 Evaluate ✅ · 📦 Solution ✅ · 🔎 Review ✅ · 💬 Address Feedback ⏭️ (skipped) · 📤 Publish ✅ |

---

## Stage Metrics

<!-- design-metrics:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the stage's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the stage. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 1h 18m 55s · Wait to date: 40s (closed 40s + current 0s) · Unclassified: 1s

| Stage                      | Started (UTC)            | Completed (UTC)          | Elapsed     | Work    | Wait | Input tokens | Output tokens | Coverage            | Attempts | Failed checks |
| -------------------------- | ------------------------ | ------------------------ | ----------- | ------- | ---- | ------------ | ------------- | ------------------- | -------- | ------------- |
| frame (completed)          | 2026-10-17T11:31:47.678Z | 2026-10-17T11:37:27.905Z | 5m 40s      | 5m 40s  | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| research (completed)       | 2026-10-17T11:37:28.063Z | 2026-10-17T11:53:09.198Z | 15m 41s     | 15m 41s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| evaluate (completed)       | 2026-10-17T11:53:09.360Z | 2026-10-17T12:01:09.189Z | 8m 0s       | 8m 0s   | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| solution (completed)       | 2026-10-17T12:01:09.347Z | 2026-10-17T12:33:01.357Z | 31m 52s     | 31m 52s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| review-gate (completed)    | 2026-10-17T12:33:01.505Z | 2026-10-17T12:37:23.184Z | 4m 22s      | 3m 42s  | 40s  | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| address-feedback (skipped) | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |
| publish (completed)        | 2026-10-17T12:37:23.324Z | 2026-10-17T12:51:23.256Z | 14m 0s      | 14m 0s  | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |

<!-- design-metrics:end -->

## Assumptions

_From Research OQ triage (2026-10-17)._

| #   | Open question                                                                                                                                    | V/E | Answer / status                                                                                                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Does "no separate authorizer component" (EC2) rule out Cognito (Opt 2) and/or a CloudFront Function (Opt 5)?                                     | (E) | Does not disqualify either — weigh as a normal tradeoff in Evaluate, not a hard exclusion.                                                                                                                   |
| 2   | Is silent token refresh in scope, or is re-login after expiry acceptable (~10 internal users)?                                                   | (V) | Silent refresh is required — any option must support a refresh-token flow.                                                                                                                                   |
| 3   | Is "wait for JWT expiry" (no instant revocation) an acceptable logout/session-invalidation SLA?                                                  | (V) | Acceptable — no deny-list or Cognito `GlobalSignOut` required to close the BSIMM finding.                                                                                                                    |
| 4   | Multi-region Lambda@Edge JWKS/secret cache staleness across edge-location replicas — acceptable risk?                                            | (E) | Acceptable; document a cache TTL policy in Solution.                                                                                                                                                         |
| 5   | Is Amazon Cognito an acceptable new AWS service dependency for this engagement?                                                                  | (V) | Acceptable, but staying within existing services (Lambda@Edge + Secrets Manager) is preferred — Cognito remains viable but deprioritized vs. Option 1.                                                       |
| 6   | Clock-skew tolerance for JWT `exp`/`nbf`/`iat` validation at the edge — viability or detail?                                                     | (E) | Standard leeway (e.g. 60–300s) is fine for all options; resolve in Solution.                                                                                                                                 |
| 7   | PKCE verifier/state cookie attributes (TTL, SameSite) and CSRF/state-replay protection on callback                                               | (E) | Standard OAuth2 PKCE cookie hardening applies equally to all options; resolve in Solution.                                                                                                                   |
| 8   | Secrets Manager payload shape change (adding an OIDC client secret alongside/instead of the hash)                                                | (E) | Straightforward extension of existing secret/`sm-push` tooling; resolve in Solution.                                                                                                                         |
| 9   | Entra app-registration redirect-URI stability vs. Admins Helpdesk lead time                                                                      | (E) | Operational risk to document/plan around; does not disqualify any option.                                                                                                                                    |
| 10  | Does "attribution" (BSIMM Finding 1) need to reach CloudFront/S3 access logs (NFR-7), or is Lambda@Edge CloudWatch execution logging sufficient? | (V) | Must reach CloudFront/S3 access logs — CloudWatch execution logging alone is not sufficient; NFR-7's access-log pipeline needs the authenticated identity (e.g. via a custom header or log-enrichment step). |

---

## WAF Assessment

_Filled in during the Evaluate phase closing step and updated by any `patterns/waf-review.md` invocation._

<!-- Append dated blocks here. Each block added by Evaluate or the waf-review pattern. -->

### WAF — Evaluate — 2026-10-17

_Recommended option: Option C's deployment shape (per-mode Lambda bundles, CDK-synth-time selection) running Option A's token flow (direct Entra ID OIDC, authorization-code + PKCE, no Cognito)._

| Pillar                 | Rating   | Headline                                                                                                                                                                    |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security               | 🟡 Amber | Standards-based OAuth2/PKCE with no unexercised auth code per deployed mode, but no MSAL safety net — hand-rolled PKCE/JWT validation is unreviewed security-sensitive code |
| Reliability            | 🟡 Amber | Per-mode bundles reduce blast radius, but no native refresh/revocation library; JWKS cache TTL and CDK `authMode` guard both undefined                                      |
| Cost Optimization      | 🟢 Green | No new paid AWS service; smaller per-mode bundles; matches developer's stated preference                                                                                    |
| Operational Excellence | 🟡 Amber | Triples build/test surface; NFR-7 access-log attribution mechanism not yet defined                                                                                          |
| Performance Efficiency | 🟢 Green | Smaller cold-start payload, no extra network hop; token-exchange edge latency untested                                                                                      |
| Sustainability         | 🟢 Green | No new always-on service; smaller per-invocation footprint                                                                                                                  |

**P1 items (resolve before implementation):**

- Independent security review of the hand-rolled OIDC/PKCE/JWT validation code
- Explicit refresh-token flow design and testing (expiry handling, fallback to re-login)
- Resolve OQ-2 — authenticated-identity attribution into CloudFront/S3 access logs (NFR-7)
- Build/deploy-time guard against a missing or mistyped CDK `authMode` context parameter (OQ-1)

Full elaboration: `design/02 Evaluate.md`

### WAF — Solution — 2026-10-17

_Target: `solution/Architecture.md` + `solution/Design.md` (the chosen approach as implemented in the solution artifacts)._

| Pillar                 | Rating   | Headline                                                                                                                                                                                                                                 |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security               | 🟡 Amber | All 4 Evaluate-phase gaps closed (open-redirect validation, invalid-signature fail-closed, dedicated signing key, cookie size budget) — only the not-yet-performed independent security review remains, tracked as a pre-production gate |
| Reliability            | 🟢 Green | Silent refresh, migration-safe default, rollout-consistency note, and a concrete handling for every failure scenario now specified                                                                                                       |
| Cost Optimization      | 🟢 Green | No new paid AWS service; unchanged from Evaluate                                                                                                                                                                                         |
| Operational Excellence | 🟢 Green | Both prior P1 gaps closed — NFR-7 attribution mechanism (D7) and `AUTH_MODE` build-time guard (D1) now concrete                                                                                                                          |
| Performance Efficiency | 🟢 Green | Unchanged; token-exchange edge latency test explicitly tracked in Efforts                                                                                                                                                                |
| Sustainability         | 🟢 Green | Unchanged                                                                                                                                                                                                                                |

**P1 items: none.** All 4 P1 items from the Evaluate-phase WAF assessment are closed via settled Architecture.md decisions (D1, D2, D3, D4, D6, D7). The independent security review (Architecture.md D2, Efforts Ticket 3) is a scheduled pre-production verification gate, not an unresolved design gap.

Full elaboration: `solution/Architecture.md`, `solution/Design.md`

---

## Gate

- Approver: Dmitry Vyrostkov
- Draft MR: https://github.com/DataArt/adlc-discovery-tool/pull/6
- Approved: 2026-10-17

---

## Efforts

| Date       | Phase       | Notes                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-17 | Frame       | Context: v1/Containers (Auth.md); 4 known requirements, 5 proposed requirements accepted; developer added Entra ID app-registration constraint (per-instance, requested from Admins Helpdesk — external/manual)                                                                                                                                                                                             |
| 2026-10-17 | Research    | @architect returned 5 options (A: direct Entra OIDC, B: Cognito-federated, C: per-mode CDK-synth bundles, D: external perimeter bolt-on, E: CloudFront Function cookie gate); developer confirmed set complete; 10 OQs triaged (4 Viability, 6 Evaluation-input)                                                                                                                                            |
| 2026-10-17 | Evaluate    | Recommended Option C's deployment shape running Option A's token flow (direct Entra ID OIDC, no Cognito) — developer's explicit steer; WAF: 2 Green, 3 Amber, 0 Red; 4 P1 items (security review, refresh-token flow, NFR-7 attribution, authMode deploy guard); 6 OQs deferred to Solution                                                                                                                 |
| 2026-10-17 | Solution    | Selected artifacts written (Architecture, Design, Stack, Efforts — 3 tickets after consolidation); @architect structural review found 6 gaps, resolved in 1 reiteration (OK on 2nd pass); 2 Mermaid syntax errors fixed interactively; design quality gate found and closed 1 gap (D9/D10 added for passphrase policy + none-mode warning); closing WAF: 4/6 Green, 1 Amber (pending security review), 0 P1 |
| 2026-10-17 | Review Gate | Draft MR #6 opened, approver Dmitry Vyrostkov; approved with no concerns — Address Feedback skipped                                                                                                                                                                                                                                                                                                         |
| 2026-10-17 | Publish     | MR approved by Dmitry Vyrostkov; docs updated: `Auth.md` (full rewrite), `Infrastructure.md` (minor delta), `Requirements.md` (NFR-1 generalized, NFR-8 added, NFR-6/NFR-7 updated); @architect review found 2 minor altitude/completeness items, resolved in 1 reiteration (OK on 2nd pass)                                                                                                                |

---

## Implementation Tickets

_Implementation tickets were not recorded — developer declined at Publish wrap-up (2026-10-17). The WBS in `solution/Efforts.md` (3 tickets) remains the reference for future implementation work._

| Ticket | Summary | Layer | Depends on |
| ------ | ------- | ----- | ---------- |
