---
name: bootstrap-client
description: Instantiate this starter kit for a new client engagement (/bootstrap-client). Collects CLIENT_NAME, ORG_PREFIX, GitHub org/repo/IDs, and Giscus config via Q&A, then runs the deterministic scripts/bootstrap/bootstrap-client.mts to apply everything. Run once per new client instance, right after cloning.
---

The developer wants to bootstrap this starter kit for a new client. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

This is a one-time setup flow with two phases: **Q&A** (this skill — judgment, wording, and external-setup steps live here) and **deterministic apply** (a script — zero free-text generation, same input always produces the same output). See `STARTER-KIT-PLAN.md`'s Personalization Inventory for the full rationale behind every value collected below.

---

## Step 1 — Client name

Ask:

> "What's the client's name? This replaces `[[CLIENT_NAME]]` everywhere across the docs (~80 occurrences)."

**Stop and wait.**

---

## Step 2 — Org prefix

Derive a suggested `ORG_PREFIX` from the client name: lowercase, alphanumeric + hyphens only, ≤20 characters. Keep it short — it feeds every AWS resource name, IAM role name, and SSM path (`{org}-{env}-{workload}-{location}-{type}-{index}`), and those have their own length ceilings.

> "Suggested org prefix: `{slug}` — used in every AWS resource name, IAM role, and SSM path. Accept, or give me a different one?"

**Stop and wait.** Validate whatever the developer confirms against `^[a-z0-9]([a-z0-9-]{0,18}[a-z0-9])?$`. If it doesn't match, explain why and ask again — don't silently coerce it.

---

## Step 3 — GitHub org/repo

Ask:

> "Which GitHub org and repo will this instance live in? (e.g. `AcmeCorp/adlc-discovery-acme`)"

**Stop and wait.**

If the repo already exists, fetch the numeric IDs the OIDC trust policy needs — deterministic, don't ask the developer to hunt these down by hand:

```bash
gh api repos/{org}/{repo} --jq '{repoId: .id, orgId: .owner.id}'
```

If the repo doesn't exist yet, this is a guarded, external side effect — present it as an instruction, never run `gh repo create` yourself:

> "Create the repo first: `gh repo create {org}/{repo} --private` (or via github.com), then tell me when it's done and I'll fetch the IDs."

**Stop and wait** until both numeric IDs are confirmed.

---

## Step 4 — Giscus (comments widget)

Explain the manual prerequisites — external side effects, presented as instructions, never run automatically:

> "Before I can wire up comments:
>
> 1. Enable **Discussions** on `{org}/{repo}` (repo Settings → General → Features)
> 2. Install the [giscus GitHub App](https://github.com/apps/giscus), scoped to `{org}/{repo}`
> 3. Create a Discussions category for comments — Announcements format, so only maintainers/giscus start new top-level discussions (reuse the name "ADLC Comments", or pick your own)
>
> Tell me once all three are done — or say skip if you want to wire up comments later."

**Stop and wait.**

If confirmed, fetch both IDs via the authenticated GraphQL API. The repo is private, so giscus.app's own unauthenticated config tool can't see it — that's expected, not a misconfiguration:

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

`repository.id` → `GISCUS_REPO_ID`. Match the category name from Step 4 above against `discussionCategories.nodes` → that node's `id` is `GISCUS_CATEGORY_ID`.

If the developer chose to skip, leave both values empty — the script handles missing Giscus values gracefully (comments stay unwired until run again later).

---

## Step 5 — Confirm before writing anything

Show the full resolved set for explicit sign-off — nothing touches disk before this:

> "Here's everything I'll apply:
>
> | Value                            |                          |
> | -------------------------------- | ------------------------ |
> | `CLIENT_NAME`                    | `{value}`                |
> | `ORG_PREFIX`                     | `{value}`                |
> | `GITHUB_ORG` / `GITHUB_ORG_ID`   | `{value}` / `{value}`    |
> | `GITHUB_REPO` / `GITHUB_REPO_ID` | `{value}` / `{value}`    |
> | `GISCUS_REPO_ID`                 | `{value or "— skipped"}` |
> | `GISCUS_CATEGORY_ID`             | `{value or "— skipped"}` |
>
> Confirm to proceed?"

**Stop and wait for explicit confirmation.**

---

## Step 6 — Dry run, then apply

Run the deterministic script in `--dry-run` mode first:

```bash
yarn bootstrap:client --client-name "{value}" --org-prefix {value} \
  --github-org {value} --github-org-id {value} \
  --github-repo {value} --github-repo-id {value} \
  [--giscus-repo-id {value}] [--giscus-category-id {value}] \
  --dry-run
```

Show the developer the output as-is (file/replacement counts — don't re-derive or summarize it yourself). Ask:

> "This will change `{N}` files (`{M}` replacements) plus the 3 `project.json` files, and scaffold `.env.dev` files where they don't already exist. Apply for real?"

**Stop and wait.** If confirmed, re-run the exact same command with `--dry-run` removed.

If the script errors (invalid input, missing required value), relay its error message directly — do not paraphrase or guess at a fix. Return to whichever step collects that value.

---

## Step 7 — Report

Summarize what changed, from the script's own final output. Then remind the developer:

- Review `git diff` before committing — Step 1's find-replace touches every file that contained `[[CLIENT_NAME]]`
- Fill in `AWS_REGION`, `LOCATION_SHORT`, `ENVIRONMENT` in the newly-scaffolded `.env.dev` files — these are deployment-environment values, not client-identity, so this skill doesn't collect them
- AWS account setup, `cdk bootstrap`, and the first `cdk deploy` are a separate step — point to the deployment runbook once it exists (Iteration 6 in `STARTER-KIT-PLAN.md`)

Suggest a commit message:

> `chore: bootstrap client — {CLIENT_NAME}`

**Stop and wait** for the developer to confirm the commit. This skill never commits or pushes on its own — `git push` is a guarded command.
