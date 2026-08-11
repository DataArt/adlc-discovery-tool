---
name: patch-prepare
description: >
  Prepare phase of the patch workflow (/patch-prepare or /patch orchestrator).
  Diffs against a base ref, lets the developer curate the file list, and writes a
  self-contained bundle folder under `.patch/`.
---

The developer wants to package changes made in this repo into a patch bundle. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

## Overview

A patch bundle is a folder under `.patch/` that carries: a manifest of added / updated / deleted files, a copy of the current content of every added/updated file, and a one-line summary of why. It does not carry a git diff — the target repo may have no shared history with this one — so the bundle must be self-contained.

---

## Step 1 — Determine the base ref

Parse `$ARGUMENTS` for a ref/tag/commit (e.g. `main`, `bbd6e34`, a tag). If one is given, use it.

If none is given:

1. Read `.patch/REGISTRY.md`. If it has a `prepared` row, propose that row's **Head Ref** as the base ref (i.e. diff since the last patch prepared from this repo).
2. If `.patch/REGISTRY.md` has no `prepared` rows yet, ask the developer for a base ref — e.g. the last commit before this session's changes started, or `origin/main`.

Confirm the resolved base ref with the developer before proceeding:

> "Diffing against `<ref>` — is that right, or should I use a different base?"

**Stop and wait.**

---

## Step 2 — Collect the diff

Against the confirmed base ref, collect:

- Tracked changes: `git diff <base-ref> --name-status` (this reflects the working tree, so it includes staged and unstaged edits, not only committed ones)
- Untracked new files: `git status --porcelain` entries starting `??`, filtered to paths relevant to the change (ask the developer if unsure whether a stray untracked file belongs)

Classify every path as **Added**, **Updated**, or **Deleted**.

---

## Step 3 — Curate with the developer

Present the full Added / Updated / Deleted list. Not everything touched in a session belongs in a portable patch — ask the developer to confirm the list as-is or strike out anything that's one-off / repo-specific to this project.

**Stop and wait** for confirmation before writing anything.

---

## Step 4 — Name the bundle

Ask for a short slug (kebab-case, e.g. `docs-restructure`) if one wasn't given in `$ARGUMENTS`.

Determine the next ID: read `.patch/REGISTRY.md`, take the highest existing ID, increment (zero-padded 4 digits — `0001` if the registry is empty).

Bundle folder: `.patch/<ID>-<YYYY-MM-DD>-<slug>/`

---

## Step 5 — Write the bundle

Create the bundle folder with:

- `manifest.md` — Added / Updated / Deleted file lists (repo-relative paths), and a short prose summary of what changed and why (this travels with the bundle into a repo with zero context of this conversation — write it for that reader)
- `files/` — for every Added and Updated path, copy its current content into `files/<same-relative-path>` (mirror the repo tree exactly, so apply can copy it straight back)

Deleted paths are recorded in `manifest.md` only — there is no content to carry for a deletion.

---

## Step 6 — Register

Append a row to `.patch/REGISTRY.md`:

| ID   | Date      | Slug     | Base Ref | Head Ref                               | Summary              | Status     |
| ---- | --------- | -------- | -------- | -------------------------------------- | -------------------- | ---------- |
| 0001 | `<today>` | `<slug>` | `<base>` | `<current HEAD sha, or "uncommitted">` | `<one-line summary>` | `prepared` |

---

## Step 7 — Report

Tell the developer:

- The bundle path
- The file counts (added / updated / deleted)
- The next step is manual: copy `.patch/<ID>-<date>-<slug>/` into the target repo's `.patch/` folder, then run `/patch-apply <ID>` there. Copying files into another local repo is the developer's call — don't do it yourself even if both repos happen to be on disk.
