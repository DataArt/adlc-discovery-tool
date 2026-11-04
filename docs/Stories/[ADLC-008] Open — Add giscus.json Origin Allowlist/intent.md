# ADLC-008: Add giscus.json Origin Allowlist — Intent

| Field   | Value                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Ticket  | ADLC-008                                                                                                                        |
| Status  | Open                                                                                                                            |
| Owner   | Unassigned — engagement lead to assign                                                                                          |
| Source  | DataArt Security Lab penetration test, `DataArt_ADLCDiscoveryTool_PenetrationTesting_Report_v1.0_10232026.pdf` (M5), 2026-10-23 |
| Created | 2026-11-04                                                                                                                      |

## Problem

The repository hosting giscus Discussions has no `giscus.json` at its root defining an allowed-origin
list. Without one, `giscus.app` accepts requests from any origin — the pentest's PoC embedded the
widget on an arbitrary third-party page, had a victim sign in through it, and posted a new discussion
into the target repo from that attacker-controlled page. This is independent of the HIGH finding
(H1, resolved — see `docs/Engineering Guide/09 Harness Security.md`) about private-repo content
exposure; it applies to a public comments repo just as much as a private one.

## Proposed outcome

A `giscus.json` file at the root of whichever repo ends up hosting Discussions (today:
`DataArt/adlc-discovery-tool`, since giscus is enabled there), restricting embedding to this site's
actual domain(s):

```json
{ "origins": ["https://<cloudfront-or-custom-domain>"] }
```

## Constraints

- Not blocking: giscus is off by default (`VITE_GISCUS_ENABLED` unset) for any new client
  engagement, so this only matters for repos that have explicitly opted in.
- The origin list needs the actual deployed domain, which may change (a custom-domain decision was
  raised separately and deferred — see the TLS supervisor-review item). Revisit this file if the
  domain changes.

## Open questions

None yet — not started.
