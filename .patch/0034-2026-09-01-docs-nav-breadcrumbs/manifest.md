# Patch 0034 — docs-nav-breadcrumbs

## Summary

Improves navigation orientation on the VitePress docs site:

- **Stories nav wired up.** Two new nav entries (🚧 WIP, 🗄️ Archive) point at `/Stories/` and `/Stories/archive/`. `scanSection` gains an `exclude` option so the WIP sidebar doesn't also list the archive folder, and `srcExclude: ['Stories/**']` is removed from `config.ts` so those routes actually get built (previously the whole Stories tree was excluded from the site, which would have made these nav links dead). New `docs/Stories/index.md` and `docs/Stories/archive/index.md` landing pages.
- **Stronger active-page highlighting.** Each top-level nav item gets an explicit `activeMatch` regex so it stays highlighted for any page under its section, not just the exact index page (VitePress's default nav matching is exact-link-only). New `theme/custom.css` gives the active nav item a filled brand-colored pill and the active sidebar item a soft background band + thicker indicator bar, both a step stronger than the default theme's subtle color-only change, with font-weight 600 (not 700 — tuned down from an initial pass that was too heavy).
- **Breadcrumb navigation.** New `theme/Breadcrumbs.vue`, wired into `Layout.vue`'s `doc-before` slot. Derives the trail from each page's `relativePath` (folder names prettified the same way `scanSection` already prettifies sidebar labels — strips a leading `NN ` number prefix), hidden on the homepage and other bare index pages with no ancestors. A new build-time scan, `collectIndexedDirs()` in `utils/sidebar.ts`, walks `docs/` for every directory containing an `index.md`/`README.md` and surfaces it through `themeConfig.indexedDirs`; the breadcrumb component uses it so folder segments with no page of their own (e.g. a bare `SDLC Domains` grouping folder) render as plain non-clickable text instead of a dead link, while folders that do have a page stay clickable.

`config.ts`'s `themeConfig` object was pulled out into its own `const themeConfig: DefaultTheme.Config & { indexedDirs: string[] }` (was previously an inline object literal on `defineConfig({...})`) so the extra `indexedDirs` field type-checks — `defineConfig` is fixed to `DefaultTheme.Config` with no index signature, and TS's excess-property check only fires on object literals passed directly into a typed slot, not on a separately-declared variable.

## Added

- `apps/docs-web/.vitepress/theme/Breadcrumbs.vue`
- `apps/docs-web/.vitepress/theme/custom.css`
- `docs/Stories/index.md`
- `docs/Stories/archive/index.md`

## Updated

- `apps/docs-web/.vitepress/config.ts`
- `apps/docs-web/.vitepress/theme/Layout.vue`
- `apps/docs-web/.vitepress/theme/index.ts`
- `apps/docs-web/.vitepress/utils/sidebar.ts`

## Renamed

None.

## Deleted

None.

## Notes for the target repo

- This bundle assumes the target repo's `config.ts` `nav`/`sidebar` shape is close to this one's (section names, HLD version constant, etc.) — the diff replaces the whole `themeConfig` block, so re-merge any target-repo-specific nav/sidebar entries that aren't in this repo (e.g. a differently named section) after applying, rather than blindly overwriting.
- Not verified against a live `yarn nx run site:serve` / `vitepress build` in this repo — the dev environment here has a pre-existing, unrelated `@rollup/rollup-darwin-x64` / `nx` `WorkspaceContext` breakage. Logic was verified with standalone Node reproductions of `scanSection`, `collectIndexedDirs`, and the breadcrumb path-derivation against this repo's real `docs/` tree, and with `tsc --noEmit` on the changed files. Recommend a visual check in the target repo once applied.
