---
name: writing-docs
metadata:
  version: 0.3.1
description: Doc writing rules — tier placement, certainty principle, DRY, naming, VitePress sidebar. Read before editing docs/. Loaded automatically — not invoked directly.
---

# Documentation Writing Rules

Read before creating or editing any file under `docs/`.

## Step 0 — Read the authoritative articles

Before writing, read both:

- `{{DOC_STRUCTURE_ARTICLE}}` — tier placement, folder structure, file naming conventions
- `{{DOC_PRINCIPLES_ARTICLE}}` — certainty principle, DRY, SoC, length budgets

These are the source of truth. The rule below is the only project-specific addition.

## Docs site sidebar

`{{DOCS_SITE_CONFIG_FILE}}` defines the site sidebar in constants or sections keyed by docs directory.

**When adding a new file** under any of the docs directories, add a corresponding entry to the matching sidebar section.

**When renaming or removing a file**, update or remove the matching entry.

This is the only step that cannot be inferred from the Engineering Guide articles — the docs delivery mechanism and its config live outside the docs content tree.
