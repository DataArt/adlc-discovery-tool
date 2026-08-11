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

---

## Step 1 — Locate the bundle(s)

Parse `$ARGUMENTS` for a bundle ID or folder name.

If given: locate `.patch/<match>/`.

If not given: scan `.patch/` for bundle folders (`NNNN-YYYY-MM-DD-<slug>/`), cross-check each ID against `.patch/REGISTRY.md`. List any bundle not already marked `applied` in this repo's registry, and ask the developer which to apply (default: all unapplied, in ID order).

If `.patch/REGISTRY.md` doesn't exist yet, create it with the same header as in `/patch-prepare` before continuing.

---

## Step 2 — Check for prior application

If the bundle's ID already has an `applied` row in `.patch/REGISTRY.md`, tell the developer and ask whether to re-apply (skip by default — idempotency matters more than convenience here).

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

Append (or update) a row in this repo's `.patch/REGISTRY.md` for the bundle's ID, with Status `applied` and today's date. Carry over the Slug and Summary from the bundle's own manifest/registry row if available.

---

## Step 7 — Report

Summarize what changed: files added, updated, deleted, and anything skipped (already applied, already up to date, or held back pending developer review). Remind the developer that nothing was staged or committed — that's their call, same as any other edit.
