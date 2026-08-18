# Patch 0017 — bootstrap-client-oidc-validation

## Summary

Adds two validation/setup steps to the `/bootstrap-client` Stage 3 (Infrastructure & Deploy) flow, plus a small `.gitignore` hardening:

- **OIDC provider check** — the GitHub Actions OIDC provider (`token.actions.githubusercontent.com`) is an AWS-account-wide singleton (see `apps/infra/bin/app.ts`'s `createOidcProvider` / `CREATE_OIDC_PROVIDER`). Before `infra:provision:dev` runs, the flow now has the developer check `aws iam list-open-id-connect-providers` and, if the provider already exists (another client/org sharing the account), set `CREATE_OIDC_PROVIDER=false` in `apps/infra/.env.dev` before provisioning — avoids `infra:provision:dev` failing with `EntityAlreadyExistsException`.
- **`CF_DISTRIBUTION_ID` handoff made explicit** — after `infra:output:dev` prints the CDK stack outputs, the flow now explicitly confirms `CF_DISTRIBUTION_ID` is copied into _both_ `apps/lambda-auth/.env.dev` and `apps/docs-web/.env.dev` before continuing to `env-push` (previously folded into a generic "copy the relevant ones" instruction).
- `.gitignore` — added `.claude/worktrees/` so git worktree scratch checkouts (used for isolated agent work) never get committed. Unrelated stray gitlink cleanup that motivated this is not part of this bundle — repo-specific.

Applying this bundle to a sibling repo updates its `.claude/skills/bootstrap-client/` (`SKILL.md`, `plan.md`, `report.md`) and root `.gitignore` to carry the same OIDC-provider and `CF_DISTRIBUTION_ID` checks. If the sibling's bootstrap-client skill has since diverged (e.g. different stage numbering), reconcile manually — this bundle carries full file content, not a diff.

## Updated

- `.claude/skills/bootstrap-client/SKILL.md`
- `.claude/skills/bootstrap-client/plan.md`
- `.claude/skills/bootstrap-client/report.md`
- `.gitignore`
