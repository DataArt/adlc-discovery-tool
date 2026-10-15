# Branching Strategy

The branching workflow is **trunk-based**, aligned with the platform's actual CI/CD automation
(`ci.yml` on pull request, `cd.yml` on merge to `main`). There is one long-lived branch — `main` —
and all work happens on short-lived branches cut from it and merged straight back in. Nothing reaches
Production without passing through the PR's required CI checks first.

## Flow

```mermaid
gitGraph
    commit id: "v1.5.0" tag: "v1.5.0"
    branch feat/adlc-042-short-desc
    commit id: "feature work"
    checkout main
    merge feat/adlc-042-short-desc id: "PR squash-merged" tag: "v1.6.0"
    branch fix/adlc-051-short-desc
    commit id: "urgent fix"
    checkout main
    merge fix/adlc-051-short-desc id: "PR squash-merged" tag: "v1.6.1"
```

## Environment Mapping

| Branch Type        | Environment Target | Notes                                                                                  |
| ------------------ | ------------------ | -------------------------------------------------------------------------------------- |
| `main`             | Dev (auto-deploy)  | Every merge triggers `cd.yml`; `nx affected --target=deploy` deploys only what changed |
| `feat/*` / `fix/*` | None (PR only)     | Validated by `ci.yml`; no preview environment is provisioned per branch                |

There is no separate `develop`/`release`/`staging` branch or environment today — see
`Infrastructure/03 CI-CD Pipeline.md` for the actual pipeline. A production-grade promotion chain
(Dev → Staging → Prod) is a deliberate future addition, not yet implemented; don't assume it exists
when reasoning about this repo.

## Naming Conventions

- **Branches:** `feat/<ticket>-<short-desc>`, `fix/<ticket>-<short-desc>`, `chore/<short-desc>`,
  `docs/<short-desc>` — see `01 Conventions.md` for the full `<type>/short-description` format
- **Tags:** `vX.Y.Z` — created automatically by semantic-release on merge to `main`, never by hand
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary),
  required for semantic-release (`feat: ...`, `fix: ...`)

## CI/CD by Branch

| Trigger               | Runs                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `feat/*` / `fix/*` PR | `ci.yml` — audit, lint, typecheck, test, build for affected projects, scoped against `origin/main`                                                     |
| `main` merge          | `cd.yml` — `nx affected --target=deploy` for affected projects; `release.yml` runs semantic-release and tags the version                               |
| Hotfixes              | No separate branch type — a `fix/*` branch off `main`, same PR gate, same deploy path. Speed comes from the pipeline being fast, not from bypassing it |

## Branch Protection

| Branch | Restrictions                                                                                                               |
| ------ | -------------------------------------------------------------------------------------------------------------------------- |
| `main` | Direct pushes disabled; at least one Code Owner approval required (`.github/CODEOWNERS`); squash merge only; no force-push |

Required status checks before merge: lint, typecheck, test, build (all `nx affected`), and
`yarn npm audit`. Stale approvals are dismissed on new commits; all PR conversations must be
resolved.

## Rollback Strategy

Every production deployment is tagged (e.g. `v1.6.0`), so any environment can be restored to a known
stable state without code changes:

1. Check out the target tag.
2. Run the deploy target for all affected apps (or a scoped subset).
3. CI/CD rebuilds and redeploys that exact tag across environments, using previously validated
   artifacts — no code modification required.

This architecture has no database, so there's no separate schema-rollback mechanism to layer on top
— artifact-based rollback (site content + Lambda@Edge version + CDK stack) is the whole story.

## Related

- [Local Provisioning Runbook](Infrastructure/01%20Local%20Provisioning%20Runbook.md) — the dev environment this branching model targets
- [CI/CD Pipeline](Infrastructure/03%20CI-CD%20Pipeline.md) — the actual `ci.yml`/`cd.yml` implementation this doc describes
- [Deploy Lifecycle](Infrastructure/02%20Deploy%20Lifecycle.md) — how each merge actually builds and deploys, per project type
- [Target Architecture](<../Target%20Architecture%20(HLD)/README.md>) — how the whole product fits together
