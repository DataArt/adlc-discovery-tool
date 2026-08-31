# Patch 0031 — sidebar-collapse-nested-sections

## Summary

`scanSection` in the VitePress sidebar generator now takes `level` and `collapseAfter` parameters (both optional, defaulting to `0` and `1`) and stamps `collapsed: level >= collapseAfter` onto every directory-derived sidebar item. Recursive calls pass `level + 1` down the tree. The net effect: top-level sidebar sections stay expanded, but any nested subsection two or more levels deep starts collapsed — keeping the sidebar readable as the docs tree grows deeper without changing which files/links appear in it.

## Files

### Updated

- `apps/docs-web/.vitepress/utils/sidebar.ts`
