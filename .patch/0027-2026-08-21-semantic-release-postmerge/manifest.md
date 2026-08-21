# Patch 0027 — semantic-release-postmerge

> ⚠️ **OPTIONAL — not recommended by default.** This patch adds `semantic-release` as a post-merge job. It is a tooling preference, not a fix or a convention this starter kit expects every sibling to adopt. Apply only if the target engagement specifically wants automated CHANGELOG/version/tag/GitHub-Release generation from Conventional Commits. See `.patch/REGISTRY.md` for the same flag on this bundle's row.

## Summary

Adds a `Release` GitHub Actions workflow that runs on every push to `main`, independent of the existing `cd.yml` deploy workflow. It runs `semantic-release` to:

- analyze commits since the last release (Conventional Commits, `conventionalcommits` preset)
- generate release notes and update `CHANGELOG.md`
- bump `package.json`'s `version` field (no npm publish — this is a private, unpublished monorepo)
- commit `CHANGELOG.md` + `package.json` back to `main` with `[skip ci]` so it doesn't retrigger `cd.yml`
- create a git tag and GitHub Release

## Why pin `conventional-changelog-conventionalcommits` to `^9.3.1` (not latest `10.x`)

The preset's `10.x` line requires `conventional-changelog-writer@9+`, but even the latest `@semantic-release/release-notes-generator@14.1.1` still bundles `conventional-changelog-writer@^8.0.0`. Using the preset's `10.x` line breaks `generateNotes` with a `Missing helper` / Handlebars error. Verified locally: `9.3.1` works with `release-notes-generator@14.1.1`'s bundled writer; `10.4.0` does not. Re-check this compatibility if bumping either package later.

## Before applying, know this

- **`package.json` is a full-file replace, not a diff.** This repo's version was pinned when its own `devDependencies` list looked like [see `files/package.json`]. If the target repo's `package.json` has since diverged (different scripts, extra deps, a different `name`/`version` field), do **not** blindly overwrite — merge the new `devDependencies` entries and the top-level `"version": "0.0.0-semantically-released"` field into the target's current file by hand instead.
- **`yarn.lock` is excluded on purpose** — it's a full lockfile snapshot specific to this repo's resolved dependency graph, not portable to a sibling with a different install history. After merging `package.json`'s new devDependencies in, run `yarn install` in the target repo to regenerate its own lockfile.
- **GitHub branch protection on `main`**: if the target repo's ruleset blocks direct pushes even from the default `GITHUB_TOKEN`, the `@semantic-release/git` commit step will fail. Either allow `github-actions[bot]` / the default token as an exemption, or don't apply this patch.
- This workflow needs `permissions: contents: write, issues: write, pull-requests: write` at the job level (already in `release.yml`) — nothing extra to configure in repo settings beyond what's default for `GITHUB_TOKEN`, unless the target org has tightened the default token permissions org-wide.

## Added

- `.github/workflows/release.yml` — the post-merge Release workflow
- `release.config.js` — semantic-release plugin pipeline (commit-analyzer → release-notes-generator → changelog → npm[no-publish] → git → github)

## Updated

- `package.json` — adds `"version": "0.0.0-semantically-released"` and these devDependencies:
  - `semantic-release@^25.0.9`
  - `@semantic-release/changelog@^7.0.0`
  - `@semantic-release/commit-analyzer@^13.0.1`
  - `@semantic-release/git@^11.0.1`
  - `@semantic-release/github@^12.0.9`
  - `@semantic-release/npm@^13.1.5`
  - `@semantic-release/release-notes-generator@^14.1.1`
  - `conventional-changelog-conventionalcommits@^9.3.1` (pinned — see above)

## Deleted

None.

## Renamed

None.
