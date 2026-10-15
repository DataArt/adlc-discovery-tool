# CI/CD Pipeline

_Automated quality gate (CI) and deployment (CD) via GitHub Actions and AWS OIDC — no long-lived credentials._

---

## Overview

CI runs on every pull request: audit, lint, typecheck, build.
CD runs on merge to `main`: `nx affected --target=deploy` deploys only what changed.

Both workflows authenticate to AWS using OIDC via `CiStack`, but each assumes a different
short-lived role: CI (pull_request) gets a read-only SSM role, CD (push to main) gets the
write-capable deploy role. No access keys exist in GitHub, and no PR can assume deploy
credentials before merge — see [OIDC authentication](#oidc-authentication).

## Target state

```mermaid
flowchart TD
    classDef gh      fill:#1e293b,stroke:#475569,color:#f8fafc,font-weight:bold
    classDef action  fill:#064e3b,stroke:#059669,color:#d1fae5
    classDef iam     fill:#581c87,stroke:#a855f7,color:#f3e8ff,font-weight:bold
    classDef ssm     fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    classDef aws     fill:#0e7490,stroke:#67e8f9,color:#ecfeff
    classDef guarded fill:#7f1d1d,stroke:#f87171,color:#fef2f2

    PR["🔀 Pull Request\n(opened · sync · reopened)"]:::gh --> CI["ci.yml\nenvironment: dev"]:::action
    MERGE["✅ Merge to main"]:::gh --> CD["cd.yml\nenvironment: dev"]:::action
    CI -->|OIDC AssumeRole, sub=...:pull_request| CIROLE["CiStack\nIAM CI Read Role\n(ssm:GetParameter only)"]:::iam
    CD -->|OIDC AssumeRole, sub=...:ref/heads/main| ROLE["CiStack\nIAM Deploy Role\n(S3 · CloudFront · Lambda write)"]:::iam

    CI --> AUDIT["npm audit\n—severity moderate"]:::action
    CI --> LINT["nx affected:lint"]:::action
    CI --> TC["nx affected:typecheck"]:::action
    CI --> BUILD["nx affected:build:ci\nlambda-auth → load_env → esbuild → zip"]:::action

    CD --> DEPLOY["nx affected —target=deploy\n—base=HEAD~1 —head=HEAD"]:::action
    DEPLOY --> SITE["site:deploy\nsite-deploy.sh\nload_env → S3 sync + CF invalidate"]:::aws
    DEPLOY --> LAE["lambda-auth:deploy\nlambda-edge-deploy.sh\nload_env → Lambda update + CF association"]:::aws

    BUILD & LAE -->|ssm:GetParameter| SSM_L["SSM\nLAMBDA_AUTH_SSM_ENV_PARAM"]:::ssm
    SITE -->|ssm:GetParameter| SSM_S["SSM\nSITE_SSM_ENV_PARAM"]:::ssm

    PROV["infra:provision\n⚠️ guarded — manual only"]:::guarded
```

---

## CI workflow (`ci.yml`)

Trigger: `pull_request` (opened, synchronize, reopened) targeting `main`.

| Step | Command                                         | Purpose                                                         |
| ---- | ----------------------------------------------- | --------------------------------------------------------------- |
| 0    | `.github/actions/aws-auth` composite            | OIDC AssumeRole (`IAM_CI_ROLE_ARN`, SSM read-only)              |
| 1    | `yarn npm audit --all --severity moderate`      | Fail on moderate-or-higher vulnerabilities                      |
| 2    | `nx affected --target=lint`                     | ESLint on changed projects                                      |
| 3    | `nx affected --target=typecheck`                | TypeScript type errors on changed projects                      |
| 4    | `nx affected --target=build --configuration=ci` | Build changed projects — lambda-auth fetches SSM before esbuild |

Affected base: `origin/<base-branch>` → `HEAD` (GitHub Actions resolves the PR target branch at runtime).

---

## CD workflow (`cd.yml`)

Trigger: `push` to `main`.

Runs a single NX step:

```
yarn nx affected --target=deploy --configuration=ci --base=HEAD~1 --head=HEAD
```

NX determines which projects changed in the merge commit. Each project's `deploy` target calls a
self-sufficient script:

| Project       | Script                             | What it does                                                                   |
| ------------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| `site`        | `scripts/ci/site-deploy.sh`        | Fetches site SSM env → S3 sync + CloudFront invalidation                       |
| `lambda-auth` | `scripts/ci/lambda-edge-deploy.sh` | Fetches lambda-auth SSM env → Lambda update + version publish + CF association |

`infra` has no `deploy` target — CDK deploy is renamed `provision` and excluded from `nx affected`.
See [Guarded operations](#guarded-operations).

---

## OIDC authentication

Both workflows run in `environment: dev`, which resolves `vars.*`. The `.github/actions/aws-auth`
composite calls `aws-actions/configure-aws-credentials` with a different `role-arn` input per
workflow:

1. GitHub generates an OIDC token scoped to the repo, the triggering event, and the workflow run
2. STS validates against `CiStack`'s OIDC provider:
   - `aud = sts.amazonaws.com`
   - `sub` is matched with `StringLike` only for **repo scoping** —
     `repo:{githubOrg}@{githubOrgId}/{githubRepo}@{githubRepoId}:*` (numeric org/repo IDs required
     for repos created after June 2026). It is **not** used to distinguish the two roles: both
     workflows declare `environment: dev` (needed to resolve `vars.*`), and GitHub overrides `sub`
     to `repo:OWNER/REPO:environment:dev` whenever a job declares an environment — identically for
     `ci.yml` and `cd.yml` — regardless of the triggering event. An earlier version of this trust
     policy tried to match an event-specific `sub` suffix and silently could never succeed.
   - The event/ref distinction instead uses separate claims unaffected by that override, matched
     with `StringEquals`: CI Read Role requires `event_name = pull_request`; Deploy Role requires
     `ref = refs/heads/main`. A `pull_request` run can never present a token satisfying the deploy
     role's trust policy, and vice versa.
3. STS returns short-lived credentials valid for the job duration, scoped to that role's
   permissions only

This means a PR branch — including one that edits `ci.yml` itself — can at most read non-secret
SSM config. It cannot write to the site bucket, touch CloudFront, or update the auth Lambda; those
permissions only exist on the Deploy Role, which only a `push` to `main` (i.e. a merged, reviewed
commit) can assume.

---

## SSM env-fetch pattern

Each build/deploy script has a `load_env()` function that fetches its SSM parameter and exports the
values into the current shell:

```bash
load_env() {
  eval "$(aws ssm get-parameter \
    --region "$AWS_REGION" \
    --name "${<APP>_SSM_ENV_PARAM:?not set}" \
    --query Parameter.Value --output text \
  | jq -r 'to_entries[] | "export \(.key)=\(.value | @sh)"')"
}

[[ "${GITHUB_ACTIONS:-false}" == "true" ]] && load_env
```

The `GITHUB_ACTIONS` guard means the same script works:

- **Locally** — NX `envFile` already loaded `.env.<env>`; `load_env` is skipped
- **CI/CD** — `load_env` fetches SSM; each app runs in its own NX subprocess so values are isolated

No `$GITHUB_ENV` export step is needed in the workflow YAML.

---

## GitHub Actions environment variables

All values live in the `dev` GitHub Actions environment (Settings → Environments → dev → Variables):

| Variable                    | Description                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `IAM_ROLE_ARN`              | `CiStack` output `DeployRoleArn` — used by `cd.yml` only — `arn:aws:iam::{account}:role/{org}-ci-docs-{loc}-role`      |
| `IAM_CI_ROLE_ARN`           | `CiStack` output `CiReadRoleArn` — used by `ci.yml` only — `arn:aws:iam::{account}:role/{org}-ci-read-docs-{loc}-role` |
| `AWS_REGION`                | Deployment region — used for OIDC auth and SSM `GetParameter` calls                                                    |
| `SITE_SSM_ENV_PARAM`        | SSM path for site config, e.g. `/{org}/dev/docs/site/env`                                                              |
| `LAMBDA_AUTH_SSM_ENV_PARAM` | SSM path for lambda-auth config, e.g. `/{org}/dev/docs/lambda-auth/env`                                                |

No bucket names, distribution IDs, or function names are stored as GitHub variables — those live in
SSM and are fetched at runtime by each script.

---

## Guarded operations

`infra:provision` (CDK deploy) is **never** run by the CD pipeline — it provisions infrastructure
and must be run manually by a developer with appropriate AWS credentials:

> `yarn nx run infra:provision:dev` — guarded; run manually after reviewing `infra:diff:dev`

The CD pipeline deploys app artefacts only (code + content). Infrastructure changes (stacks,
CloudFront config, IAM) always go through a manual `infra:provision`. See `02 Deploy Lifecycle.md`
for the full manual deploy sequence.
