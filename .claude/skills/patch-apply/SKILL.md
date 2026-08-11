---
name: patch-apply
description: >
  Apply phase of the patch workflow (/patch-apply or /patch orchestrator).
  Applies a bundle already copied into `.patch/` in this repo, file by file,
  with a diff review before each overwrite.
---

The developer wants to apply a patch bundle to this repo. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

## Overview

A patch bundle (see `/patch-prepare`) is a self-contained folder under `.patch/`: a `manifest.md` listing added/updated/deleted paths, and a `files/` tree with the new content for every added/updated path. This repo has no shared git history with wherever the bundle came from — treat every overwrite as a potential conflict with local changes, not a mechanical copy.

This repo tracks applied bundles in its own `.patch/APPLIED.md` — never in `.patch/REGISTRY.md`. `REGISTRY.md` belongs to `/patch-prepare` and records bundles _this repo prepared_ for others; its IDs are only unique within this repo's own sequence. A bundle copied in from a sibling repo carries an ID that was sequential _there_, so two incoming bundles (or an incoming bundle and a locally-prepared one) can legitimately share the same numeric ID. `APPLIED.md` keys off the full bundle folder name (`NNNN-YYYY-MM-DD-slug`) for exactly this reason, and the two files are never merged.

If more than one bundle needs applying, apply them **one at a time, start to finish** (Steps 2–7 for bundle A — including its commit-message suggestion and stop — fully done before starting bundle B). Don't read multiple manifests up front or interleave file writes across bundles — each bundle's placeholder-resolution and conflict decisions are independent, and mixing them risks attributing one bundle's edits to another. The per-bundle stop in Step 7 also keeps each bundle as its own committable unit, rather than one large commit mixing unrelated changes from several bundles.

---

## Step 1 — Locate the bundle(s)

Parse `$ARGUMENTS` for a bundle ID or folder name.

If given: locate `.patch/<match>/`.

If not given: scan `.patch/` for bundle folders (`NNNN-YYYY-MM-DD-<slug>/`), cross-check each folder name against `.patch/APPLIED.md`. List any bundle not already marked `applied` in this repo's applied registry, and ask the developer which to apply and in what order (default: all unapplied, oldest date first).

If `.patch/APPLIED.md` doesn't exist yet, create it (header shown in Step 6) before continuing.

Once the list and order are confirmed, work through it one bundle at a time — repeat Steps 2–7 per bundle, stopping after each — rather than batching.

---

## Step 2 — Check for prior application

If this bundle's folder name already has an `applied` row in `.patch/APPLIED.md`, tell the developer and ask whether to re-apply (skip by default — idempotency matters more than convenience here).

---

## Step 3 — Read the manifest

Read `manifest.md` in full: the Added / Updated / Deleted lists and the summary. Read the summary before touching any file — it's the only context this repo has for _why_ the change was made.

---

## Step 4 — Resolve this repo's placeholders

The source repo a bundle came from may still be unbootstrapped (placeholders like `[[CLIENT_NAME]]` left literal) or bootstrapped for a _different_ client than this repo. Before writing anything, find this repo's real values so incoming content lands correctly, not with someone else's placeholder or someone else's client name:

1. Read this repo's own `CLAUDE.md` (the Why section) to find the real values already substituted here — e.g. the client name.
2. Scan the bundle's `files/` for bracket placeholders (`[[...]]`) and, separately, for any _other_ client name that doesn't match this repo's own (a sign the bundle came from a repo bootstrapped for someone else).
3. If a mapping is obvious (this repo has exactly one client name, the bundle uses exactly one placeholder or foreign name), propose the substitution and confirm before applying:
   > "This bundle uses `[[CLIENT_NAME]]` / mentions `<foreign name>` — replace with `<this repo's real name>` throughout before writing? (yes / no / let me specify)"
4. If it's not obvious (multiple candidate names, or this repo's own CLAUDE.md still has unresolved placeholders), stop and ask rather than guessing.

Apply the confirmed substitution to file content in memory before Step 5 — never write the bundle's raw `[[...]]` placeholder or a foreign client name into this repo.

---

## Step 5 — Apply file by file

For each **Added** or **Updated** path:

1. Take `files/<path>` from the bundle (after the Step 4 substitution) as the incoming content, and read the current repo file at `<path>` if it exists.
2. If the file doesn't exist yet in this repo: it's a clean add — create it.
3. If it exists and is identical to the incoming content: skip, nothing to do.
4. If it exists and differs: show the diff. If the existing content looks like it carries local, repo-specific edits (not just the expected pre-patch baseline), flag that explicitly and ask before overwriting — don't assume the incoming version should always win.

For each **Deleted** path:

1. If it doesn't exist in this repo: nothing to do, note it as already absent.
2. If it exists: confirm before deleting — a file with the same path may have been repurposed locally.

Batch the confirmations sensibly (e.g. "these 6 are clean adds, apply all?") rather than prompting once per file when there's nothing ambiguous to decide.

---

## Step 6 — Register

Append (or update) a row in this repo's `.patch/APPLIED.md` for this bundle, with Status `applied` and today's date. Carry over the ID, Slug, and Summary from the bundle's own `manifest.md`. Create the file with this header if it doesn't exist yet:

```markdown
# Applied Patches

Tracks patch bundles applied _to this repo_ from sibling projects. Local to this repo — does not sync itself, and is separate from `.patch/REGISTRY.md` (this repo's own _prepared_ bundles). Keyed by bundle folder name, not bare ID, since IDs are only sequential within their repo of origin.

| Bundle Folder | Date Applied | Slug | Summary | Status |
| ------------- | ------------ | ---- | ------- | ------ |
```

Then append one row per bundle:

| Bundle Folder        | Date Applied | Slug     | Summary                               | Status    |
| -------------------- | ------------ | -------- | ------------------------------------- | --------- |
| `<full folder name>` | `<today>`    | `<slug>` | `<one-line summary from manifest.md>` | `applied` |

---

## Step 7 — Suggest a commit, then stop

Summarize this bundle's outcome: files added, updated, deleted, and anything skipped (already up to date, or held back pending developer review). Propose a commit message for _this bundle's changes only_, following this repo's Conventional Commits format (`<type>(<scope>): <what>`, per root `CLAUDE.md`) — infer type/scope from the manifest summary and the paths touched.

**Stop here and wait.** Committing is the developer's call, same as any other edit — don't stage or commit it yourself. Only after they respond should you proceed: if more unapplied bundles remain in the list confirmed back in Step 1, return to Step 2 for the next one; otherwise the batch is done.

---

## Step 8 — Final report

Once every bundle in the batch has been through Steps 2–7, give one short closing summary listing each bundle applied (or skipped) in order. No further action needed beyond what was already confirmed per bundle.
