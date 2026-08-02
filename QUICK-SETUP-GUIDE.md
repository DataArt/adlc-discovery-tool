# Quick Setup Guide

_The path from an empty clone of this starter kit to a live, deployed client instance. One entry per step — short instruction, plus a reference where a fuller guide exists. Populated progressively — steps without a guide yet are marked `—`._

```mermaid
flowchart LR
    classDef done  fill:#064e3b,stroke:#059669,color:#d1fae5,font-weight:bold
    classDef here  fill:#7c2d12,stroke:#f97316,color:#ffedd5,font-weight:bold
    classDef todo  fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe

    A["1. Prerequisites"]:::done --> B["2. Environment"]:::done
    B --> C["3. Empty git repo"]:::done
    C --> D["4. Initial commit"]:::done
    D --> E["5. Bootstrap"]:::done
    E --> F["6. Repo Discussions"]:::done
    F --> G["7. Infra provisioning"]:::done
    G --> H["8. Deployment"]:::done
    H --> I["9. CI/CD"]:::here
```

---

## 1. Prerequisites

Install Node `>=24`, Yarn 4, and the GitHub CLI — later steps (repo creation, Discussions, giscus IDs, CI/CD variables) all run through `gh`.

```bash
nvm install 24      # installs and switches to Node 24
corepack enable      # activates Yarn 4 via the packageManager field
yarn install         # installs all workspace deps
brew install gh      # GitHub CLI
gh auth login        # authenticate gh — required before any gh command below
```

→ See `docs/Engineering Guide/05 Getting Started.md`

---

## 2. Environment

Copy the env file, fill in your credentials, then launch Claude Code with them loaded.

```bash
cp .env.example .env   # scaffold your local env file
# edit .env with your credentials
source .env && claude  # load credentials into the shell, then launch Claude Code
```

→ See `docs/Engineering Guide/06 MCP Setup.md`

---

## 3. Empty git repo

Create a new, empty GitHub repo for this client instance.

```bash
gh repo create {org}/{repo} --private   # creates the empty client repo on GitHub
```

---

## 4. Initial commit

Reset to a single fresh commit — don't carry this starter kit's own development history (bootstrap tooling commits, etc.) into the client's repo — then repoint `origin` and push.

```bash
git clone https://github.com/DataArt/adlc-discovery-tool.git   # clone the starter kit itself
cd adlc-discovery-tool
git checkout --orphan client-init                          # new branch with no commit history
git add -A
git commit -m "chore: initial commit — starter kit"        # single commit holding the whole starter kit
git branch -D main                                          # drop old main (still had this tool's own history)
git branch -m main                                           # rename client-init to main
git remote remove origin                                    # detach from this tool's own repo
git remote add origin git@github.com:{org}/{repo}.git       # point at the new client repo
git push -u origin main                                     # push the fresh single-commit history
```

**Alternative — via GitHub UI (covers steps 3–4 in one action):** if `adlc-discovery-tool` is marked as a [template repository](https://github.com/DataArt/adlc-discovery-tool), GitHub can do the empty-repo creation and the fresh-history reset for you:

1. Go to `https://github.com/DataArt/adlc-discovery-tool`
2. Click **Use this template → Create a new repository**
3. Set the owner and repo name, choose **Private**, click **Create repository**

GitHub creates the new repo with a single fresh commit — no CLI, no orphan-branch steps needed. Then just clone it locally:

```bash
git clone git@github.com:{org}/{repo}.git
cd {repo}
```

---

## 5. Bootstrap

Run the bootstrap skill in Claude Code — collects client identity (name, org prefix, GitHub org/repo), applies everything deterministically via a script, and optionally drafts the narrative "story" sections.

```
/bootstrap-client
```

→ See `.claude/skills/bootstrap-client/SKILL.md`

---

## 6. Repo Discussions

```bash
gh api repos/{org}/{repo} -X PATCH -f has_discussions=true   # turns on the Discussions tab
```

**Alternative — via GitHub UI:** repo → **Settings → General → Features** → check **Discussions**.

Then, via the browser regardless of which path above you took (no CLI equivalent for either):

1. Install the [giscus GitHub App](https://github.com/apps/giscus), scoped to `{org}/{repo}`.
2. Create a Discussions category for comments — Announcements format, so only maintainers/giscus start new top-level discussions (repo → Discussions tab → "New category"). Note the category name — you'll need it below.

**Private repos — no UI path for the giscus IDs.** giscus.app's own configuration wizard needs public visibility to auto-detect a repo and won't work here, and GitHub's embedded GraphQL Explorer no longer exists — an unauthenticated `api.github.com/graphql` request in the browser just hits anonymous rate limits. Capture both IDs via the authenticated GraphQL API instead:

```bash
gh api graphql -f query='
  query {
    repository(owner: "{org}", name: "{repo}") {
      id
      discussionCategories(first: 10) {
        nodes { id name }
      }
    }
  }
'
```

`repository.id` → `GISCUS_REPO_ID`. Match the category name you created above against `discussionCategories.nodes` → that node's `id` → `GISCUS_CATEGORY_ID`. This is exactly what Step 5's bootstrap flow runs on your behalf, so no separate action is needed here if you're filling these in through `/bootstrap-client` — this is for capturing them by hand if you need the values outside that flow.

Handled inline as part of bootstrap — called out here since it's a manual, external action, not something the script applies.

→ See `.claude/skills/bootstrap-client/SKILL.md` (Step 4)

---

## 7. Infra provisioning

Prerequisite — authenticate via AWS SSO before running anything below:

```bash
aws sso login --profile "$AWS_PROFILE"       # opens a browser, refreshes SSO credentials
aws sts get-caller-identity --profile "$AWS_PROFILE"   # confirms the session is valid
```

→ See `docs/Engineering Guide/06 MCP Setup.md` (AWS section)

```bash
yarn nx run infra:bootstrap:dev        # one-time per AWS account/region — provisions the CDK toolkit stack
yarn nx run infra:provision:dev        # creates CloudFront, S3, Lambda@Edge IAM roles, Secrets Manager secret
yarn nx run infra:output:dev           # prints stack outputs (distribution ID, bucket name, etc.)
# copy printed outputs into apps/lambda-auth/.env.dev and apps/docs-web/.env.dev
yarn nx run infra:env-push:dev         # writes infra's .env.dev to SSM Parameter Store
yarn nx run lambda-auth:env-push:dev   # writes lambda-auth's .env.dev to SSM Parameter Store
yarn nx run site:env-push:dev          # writes docs-web's .env.dev to SSM Parameter Store

# sm-push reads apps/lambda-auth/.secrets.dev, not .env.dev — generate the password hash first
cp apps/lambda-auth/.secrets.example apps/lambda-auth/.secrets.dev   # if it doesn't already exist
node -e "const{createHash}=require('crypto');console.log(createHash('sha256').update('your-password').digest('hex'))"
# paste the printed hash into DOCS_BASIC_AUTH_HASH= in apps/lambda-auth/.secrets.dev

yarn nx run lambda-auth:sm-push:dev    # writes the basic-auth password hash to Secrets Manager
```

`infra:bootstrap` and `infra:provision` are guarded commands — run manually, do not let Claude Code run them for you.

→ See `docs/Engineering Guide/Infrastructure/01 Local Provisioning Runbook.md`

---

## 8. Deployment

```bash
yarn nx run lambda-auth:deploy:dev   # builds, zips, uploads the auth handler; restores the CloudFront association
yarn nx run site:deploy:dev          # builds the VitePress site and syncs it to S3
```

Subsequent deploys only need to re-run the target(s) for what actually changed.

→ See `docs/Engineering Guide/Infrastructure/02 Deploy Lifecycle.md`

---

## 9. CI/CD

The pipeline itself (`.github/workflows/ci.yml`, `cd.yml`, `.github/actions/aws-auth`) already ships with the starter kit — nothing to build here. This step just wires this instance's values into the repo's GitHub Actions `dev` environment so those workflows can authenticate via OIDC and find their config.

`IAM_ROLE_ARN` comes from `CiStack`'s own output — there was no target for this until now (`infra:output:dev` only ever covered `DocsStack`); use the new `output-ci` target:

```bash
yarn nx run infra:output-ci:dev   # prints CiStack's DeployRoleArn
```

Create the `dev` environment (if it doesn't already exist) and set its variables:

```bash
gh api repos/{org}/{repo}/environments/dev -X PUT   # creates the "dev" environment

gh variable set IAM_ROLE_ARN --env dev --repo {org}/{repo} --body "{value from infra:output-ci:dev}"
gh variable set AWS_REGION --env dev --repo {org}/{repo} --body "{value from apps/infra/.env.dev}"
gh variable set SITE_SSM_ENV_PARAM --env dev --repo {org}/{repo} --body "/{org_prefix}/dev/docs/site/env"
gh variable set LAMBDA_AUTH_SSM_ENV_PARAM --env dev --repo {org}/{repo} --body "/{org_prefix}/dev/docs/lambda-auth/env"
```

No bucket names, distribution IDs, or function names go here — those stay in SSM and are fetched at runtime by each deploy script.

→ See `docs/Engineering Guide/Infrastructure/03 CI-CD Pipeline.md`
