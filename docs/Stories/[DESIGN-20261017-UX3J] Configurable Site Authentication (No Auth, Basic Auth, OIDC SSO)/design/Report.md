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
current_stage: research
completed_stages: [frame]
selected_artifacts: []
next_action: 'Proceed to Research'
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
| Phase  | 📋 Frame ✅ · 🔍 Research 🔄 · 🏗 Evaluate ⏳ · 📦 Solution ⏳ · 🔎 Review ⏳ · 💬 Address Feedback ⏳ · 📤 Publish ⏳ |

---

## Stage Metrics

<!-- design-metrics:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the stage's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the stage. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 5m 40s · Wait to date: 0s (closed 0s + current 0s) · Unclassified: 0s

| Stage                      | Started (UTC)            | Completed (UTC)          | Elapsed     | Work   | Wait | Input tokens | Output tokens | Coverage            | Attempts | Failed checks |
| -------------------------- | ------------------------ | ------------------------ | ----------- | ------ | ---- | ------------ | ------------- | ------------------- | -------- | ------------- |
| frame (completed)          | 2026-10-17T11:31:47.678Z | 2026-10-17T11:37:27.905Z | 5m 40s      | 5m 40s | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| research (active)          | 2026-10-17T11:37:28.063Z | unavailable              | unavailable | 0s     | 0s   | unavailable  | unavailable   | from_tracking_start | 1        | 0             |
| evaluate (pending)         | unavailable              | unavailable              | unavailable | 0s     | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |
| solution (pending)         | unavailable              | unavailable              | unavailable | 0s     | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |
| review-gate (pending)      | unavailable              | unavailable              | unavailable | 0s     | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |
| address-feedback (pending) | unavailable              | unavailable              | unavailable | 0s     | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |
| publish (pending)          | unavailable              | unavailable              | unavailable | 0s     | 0s   | unavailable  | unavailable   | from_tracking_start | 0        | 0             |

<!-- design-metrics:end -->

## Assumptions

_Filled in during Research OQ triage. One row per open question answered or classified._

| #   | Open question | V/E | Answer / status |
| --- | ------------- | --- | --------------- |

---

## WAF Assessment

_Filled in during the Evaluate phase closing step and updated by any `patterns/waf-review.md` invocation._

<!-- Append dated blocks here. Each block added by Evaluate or the waf-review pattern. -->

---

## Gate

- Approver: —
- Draft MR: —
- Approved: —

---

## Efforts

| Date       | Phase | Notes                                                                                                                                                                                                           |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-17 | Frame | Context: v1/Containers (Auth.md); 4 known requirements, 5 proposed requirements accepted; developer added Entra ID app-registration constraint (per-instance, requested from Admins Helpdesk — external/manual) |

---

## Implementation Tickets

_Filled in during Publish after implementation tickets are recorded._

| Ticket | Summary | Layer | Depends on |
| ------ | ------- | ----- | ---------- |
