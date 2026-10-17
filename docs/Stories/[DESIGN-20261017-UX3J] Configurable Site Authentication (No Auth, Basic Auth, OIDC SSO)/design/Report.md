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
current_stage: solution
completed_stages: [frame, research, evaluate]
selected_artifacts: []
next_action: 'Proceed to Solution'
context_fingerprint: ''
```

Update this block whenever a phase starts, completes, or is invalidated. The
`selected_artifacts` values are interface names (`architecture`, `design`, `stack`,
`efforts`) and are the source of truth for downstream review, publish, and resume.

## Evidence

| Source                                      | Read at stage | Relevant decision or constraint                                                         | Reference/version                     |
| ------------------------------------------- | ------------- | --------------------------------------------------------------------------------------- | ------------------------------------- |
| BSIMM review (Dmitry Vyrostkov, 2026-10-15) | Frame         | No SSO — single shared Basic Auth password, no per-user identity/attribution/revocation | Supervisor comment, 15 Oct 2026 21:26 |
| BSIMM review (Dmitry Vyrostkov, 2026-10-15) | Frame         | No password policy — any value accepted as the shared Basic Auth password               | Supervisor comment, 15 Oct 2026 21:26 |
| `apps/lambda-auth/src/handler.ts`           | Frame         | Current Basic Auth implementation — Lambda@Edge viewer-request function                 | Repo, as of 2026-10-17                |

## Status

| Field  | Value                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| Ticket | DESIGN-20261017-UX3J                                                                                                  |
| Status | 🔄 In Progress                                                                                                        |
| Phase  | 📋 Frame ✅ · 🔍 Research ✅ · 🏗 Evaluate ✅ · 📦 Solution 🔄 · 🔎 Review ⏳ · 💬 Address Feedback ⏳ · 📤 Publish ⏳ |

---

## Stage Metrics

<!-- design-metrics:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the stage's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the stage. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 29m 21s · Wait to date: 0s (closed 0s + current 0s) · Unclassified: 1s

| Stage                      | Started (UTC)            | Completed (UTC)          | Elapsed     | Work    | Wait | Input tokens | Output tokens | Coverage            | Attempts | Failed checks |
| -------------------------- | ------------------------ | ------------------------ | ----------- | ------- | ---- | ------------ | ------------- | ------------------- | -------- | ------------- |
| frame (completed)          | 2026-10-17T11:31:47.678Z | 2026-10-17T11:37:27.905Z | 5m 40s      | 5m 40s  | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| research (completed)       | 2026-10-17T11:37:28.063Z | 2026-10-17T11:53:09.198Z | 15m 41s     | 15m 41s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| evaluate (completed)       | 2026-10-17T11:53:09.360Z | 2026-10-17T12:01:09.189Z | 8m 0s       | 8m 0s   | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| solution (active)          | 2026-10-17T12:01:09.347Z | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| review-gate (pending)      | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |
| address-feedback (pending) | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |
| publish (pending)          | unavailable              | unavailable              | unavailable | 0s      | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |

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

---

## Gate

- Approver: —
- Draft MR: —
- Approved: —

---

## Efforts

| Date       | Phase    | Notes                                                                                                                                                                                                                                                                                       |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-17 | Frame    | Context: v1/Containers (Auth.md); 4 known requirements, 5 proposed requirements accepted; developer added Entra ID app-registration constraint (per-instance, requested from Admins Helpdesk — external/manual)                                                                             |
| 2026-10-17 | Research | @architect returned 5 options (A: direct Entra OIDC, B: Cognito-federated, C: per-mode CDK-synth bundles, D: external perimeter bolt-on, E: CloudFront Function cookie gate); developer confirmed set complete; 10 OQs triaged (4 Viability, 6 Evaluation-input)                            |
| 2026-10-17 | Evaluate | Recommended Option C's deployment shape running Option A's token flow (direct Entra ID OIDC, no Cognito) — developer's explicit steer; WAF: 2 Green, 3 Amber, 0 Red; 4 P1 items (security review, refresh-token flow, NFR-7 attribution, authMode deploy guard); 6 OQs deferred to Solution |

---

## Implementation Tickets

_Filled in during Publish after implementation tickets are recorded._

| Ticket | Summary | Layer | Depends on |
| ------ | ------- | ----- | ---------- |
