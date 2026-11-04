# ADLC-005: Pin GitHub Actions to Commit SHAs — Intent

| Field   | Value                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------- |
| Ticket  | ADLC-005                                                                                                               |
| Status  | Open                                                                                                                   |
| Owner   | Unassigned — engagement lead to assign                                                                                 |
| Source  | Supervisor security review (Dmitry Vyrostkov), 15th Oct 2026 — "Identified vulnerabilities are tracked and remediated" |
| Created | 2026-11-04                                                                                                             |

## Problem

`.github/workflows/*.yml` and `.github/actions/*/action.yml` reference third-party actions by
version tag (`actions/checkout@v7`, `aws-actions/configure-aws-credentials@v6`,
`actions/setup-node@v6.5.0`, `actions/cache@v5`, `aquasecurity/trivy-action@v0.36.0`). A tag is
mutable — its maintainer can repoint it to a different commit at any time, including a
compromised one, and the pipeline would start running it on the next run with no change on this
repo's side. This is the supply-chain-hardening half of the same review item that also flagged
unpinned MCP server versions (resolved separately — see `09 Harness Security.md`).

## Proposed outcome

Every third-party `uses:` reference in `.github/workflows/` and `.github/actions/` is pinned to a
commit SHA, with the human-readable version as a trailing comment (matching the pattern already
used for `aquasecurity/setup-trivy` in `.github/actions/trivy-setup/action.yml` before it was
reverted to the direct-download approach). First-party `./.github/actions/*` references and this
repo's own reusable workflows are unaffected.

## Affected files

- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`
- `.github/workflows/release.yml`
- `.github/actions/aws-auth/action.yml`
- `.github/actions/setup/action.yml`

## Constraints

- A SHA pin needs a comment with the equivalent tag (`# v7`) so a human diff-reviewing a bump
  doesn't have to resolve the SHA themselves.
- Dependabot/Renovate (if configured later) must be able to keep SHA pins current — check whichever
  tool is in use understands SHA-pinned `uses:` lines before relying on it for this.

## Open questions

None yet — not started.
