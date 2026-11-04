# Giscus Setup

_Manual runbook for wiring up the comments widget — only needed if this was skipped during `/bootstrap-client`._

---

## When you need this

`/bootstrap-client` walks through this as part of Stage 2 (step 2.4) and can be skipped there if Discussions/giscus aren't ready yet. If comments show "giscus is not installed on this repository" (or the widget doesn't render at all), check in this order: `VITE_GISCUS_ENABLED=true` in `apps/docs-web/.env.<env>` first (the widget is off by default — see the warning below), then `VITE_GITHUB_ORG` / `VITE_GITHUB_REPO` / `VITE_GISCUS_REPO_ID` / `VITE_GISCUS_CATEGORY_ID`.

---

## ⚠️ Only for a public repository

giscus is designed to work only with a **public** GitHub repository. Pointed at a private one,
giscus.app's API still serves that repo's Discussions content to any unauthenticated caller on
the internet — bypassing both GitHub's own repo permissions and this site's `AUTH_MODE` gate
entirely. This was confirmed by penetration testing (see `09 Harness Security.md`), not a
theoretical concern.

If `{org}/{repo}` is private and staying private, do not enable giscus here — leave
`VITE_GISCUS_ENABLED` unset and skip the rest of this runbook. giscus's own recommended pattern
for this situation is a separate, dedicated public repo holding nothing but Discussions, but this
starter kit's `VITE_GITHUB_REPO` is shared with the site's "View on GitHub" nav link (`config.ts`),
so wiring that up cleanly needs its own decision/implementation — it is not a drop-in env var
change today.

---

## Step 1 — Enable GitHub Discussions

```bash
gh api repos/{org}/{repo} -X PATCH -f has_discussions=true
```

Or via the browser: repo → **Settings → General → Features** → check **Discussions**.

---

## Step 2 — Install the giscus GitHub App

Install the [giscus GitHub App](https://github.com/apps/giscus), scoped to `{org}/{repo}`.

---

## Step 3 — Create a Discussions category

Repo → **Discussions** tab → **New category**. Use **Announcements** format, so only maintainers/giscus start new top-level discussions — not open floor for arbitrary new discussions. Name it whatever you like (this repo uses "ADLC Comments"); note the name, you'll need it in Step 4.

---

## Step 4 — Capture the repo ID and category ID

**Private repos have no UI path for this** — giscus.app's own configuration wizard needs public visibility to auto-detect a repo, and GitHub's embedded GraphQL Explorer no longer exists. Use the authenticated GraphQL API instead:

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

`repository.id` → `GISCUS_REPO_ID`. Match the category name from Step 3 against `discussionCategories.nodes` → that node's `id` → `GISCUS_CATEGORY_ID`.

---

## Step 5 — Wire the values into `apps/docs-web/.env.<env>`

```
VITE_GITHUB_ORG=<org>
VITE_GITHUB_REPO=<repo>
VITE_GISCUS_REPO_ID=<value from Step 4>
VITE_GISCUS_CATEGORY_ID=<value from Step 4>
```

These are `VITE_`-prefixed because Vite inlines them at **build time**, not deploy time — see `03 CI-CD Pipeline.md` for why the CI build step (not just the deploy step) must have these loaded before it runs. Push to SSM and rebuild/redeploy:

```bash
yarn nx run site:env-push:dev
yarn nx run site:deploy:dev
```

---

## Verify

Open any documentation page (not the homepage — the widget is intentionally excluded there) and confirm the giscus widget renders at the bottom of the content, below the page footer.
