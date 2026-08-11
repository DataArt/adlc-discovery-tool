# Bundle 0004 — lld-container-docs

Prepared: 2026-08-11
Base ref: `1eceedc`

## Summary

Scanned the code in `apps/docs-web/`, `apps/lambda-auth/`, and `apps/infra/` (source of truth) and added LLD container docs for the Web, Auth, and Infrastructure containers, following the same format already established by the pre-existing `Discuss/00. Overview.md` doc (Overview → Component detail → Integration patterns → Key decisions, each under the repo's 120-line LLD budget). This brings the LLD folder to 1:1 parity with the four HLD containers (Web, Auth, Infrastructure, Discuss).

`docs/System Architecture (LLD)/README.md` was updated to index all four containers, in the same order as the HLD's `System Overview.md` container table.

`Discuss/00. Overview.md` picked up one incidental one-line change (its Mermaid diagram direction: `flowchart TD` → `flowchart LR`) — unrelated to the LLD work above but included per developer confirmation.

If the target repo's HLD containers differ from Web/Auth/Infrastructure/Discuss, or its `apps/` layout differs from this starter kit's default (`apps/docs-web/`, `apps/lambda-auth/`, `apps/infra/`), review the new LLD docs' content for accuracy against that repo's actual code before applying — these docs describe implementation detail specific to this repo's code as scanned on 2026-08-11, not generic guidance.

## Added

- `docs/System Architecture (LLD)/Web/00. Overview.md`
- `docs/System Architecture (LLD)/Auth/00. Overview.md`
- `docs/System Architecture (LLD)/Infrastructure/00. Overview.md`

## Updated

- `docs/System Architecture (LLD)/README.md` — container index table extended from 1 row (Discuss only) to 4 rows (Web, Auth, Infrastructure, Discuss)
- `docs/System Architecture (LLD)/Discuss/00. Overview.md` — Mermaid diagram direction changed from `flowchart TD` to `flowchart LR`

## Deleted

None.
