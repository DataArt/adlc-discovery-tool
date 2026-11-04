# Patch 0037 — docs-web-collapsible-sidebars

**Base ref:** `c145711` (fix(auth): make lambda-auth build cache depend on AUTH_MODE/SM vars)
**Head ref:** `uncommitted`

## Summary

Adds collapsible left/right sidebars to the VitePress docs site theme, with
the prose content area adapting to fill the freed width — not just hiding
the panel. Originated in the Collinson sibling repo (prepared there as its
own bundle 0027) and pulled back into this canonical repo, since the
feature is generically useful and not Collinson-specific.

Three nav controls:

- Two small edge-tab handles pinned to the left sidebar's and right
  outline's own rendered boundary (tracked live via `ResizeObserver`
  against the actual DOM, not duplicated/hardcoded breakpoint math), so
  they stay pixel-accurate at every viewport width without needing to track
  VitePress's own CSS media-query math.
- A square "focus mode" button in the nav bar, right next to the
  appearance/theme switch (reordered there via flexbox `order`, since
  VitePress's own nav-bar slots don't expose a position directly adjacent
  to it), that collapses or restores both panels in one click.

Mechanism: collapsing the left sidebar zeroes `--vp-sidebar-width` on
`<html>`. VitePress's own CSS already reads that one variable for both the
sidebar panel's width (`VPSidebar.vue`) and the content area's
`padding-left` (`VPContent.vue`), so zeroing it collapses the panel and
hands the content its freed width in the same move — no extra layout math
needed on the content side. The right aside has no equivalent variable (its
width is fixed px values in `VPDoc.vue`), so it's hidden directly
(`display: none`) and the prose column's own `max-width` cap is relaxed to
match when the aside is hidden, so text actually spreads into the reclaimed
space instead of just re-centring in its old, narrower column.

All three controls read/write the same `<html>` classes
(`sidebar-collapsed`, `aside-collapsed`) and `localStorage` keys through a
shared composable (`useSidebarCollapse.ts`) backed by a `MutationObserver`
on `<html>`'s `class` attribute — so every control's own visual state (which
chevron direction, whether the focus button shows "active") stays correct
regardless of which control a visitor used last, without needing props or a
central store. State persists per-browser in `localStorage` and is applied
before Vue hydrates via an inline script added to `config.ts`'s `head`
array (the same pattern VitePress itself uses for dark-mode persistence),
so there's no flash of a panel re-expanding on page load.

Collapse/expand has **no transition** — panel fades and a sliding edge-handle
both read as input lag, so every transition touching these states is
explicitly set to `transition: none` in the collapsed-state CSS rules.

**Note on `config.ts`/`Layout.vue`/`custom.css` in the target repo**: this
canonical repo had diverged from the Collinson source's base in ways
unrelated to this feature (markdown container registration, giscus opt-in
gating, a Demo nav section, security hardening on `config.ts`'s `markdown.html`
flag) — `config.ts` and `Layout.vue` were hand-merged here, not overwritten,
to preserve that divergence; only the actual delta (the `head` pre-hydration
script, two new `Layout.vue` template slots) was applied. `custom.css`'s
collapse rules are purely additive — appended after this repo's existing
content, no conflicts, since this repo already had the
`--vp-layout-max-width`/`max-width: 1000px` override the new CSS builds on.
A target repo applying this bundle should do the same kind of careful merge
if its own `config.ts`/`Layout.vue`/`custom.css` have diverged from a clean
base — do not blindly overwrite these three files.

Verified with `site:typecheck`, `site:lint`, and `site:build` — all clean.

## Files

### Added

- `apps/docs-web/.vitepress/theme/SidebarToggles.vue` — the two edge-tab
  handles.
- `apps/docs-web/.vitepress/theme/SidebarFocusToggle.vue` — the combined
  square focus-mode button.
- `apps/docs-web/.vitepress/theme/useSidebarCollapse.ts` — the shared
  `MutationObserver`-backed collapse-state composable.

### Updated

- `apps/docs-web/.vitepress/config.ts` — adds the pre-hydration inline
  `<script>` that applies persisted collapse state from `localStorage`
  before paint.
- `apps/docs-web/.vitepress/theme/Layout.vue` — wires `SidebarToggles.vue`
  into the `layout-top` slot (always rendered, outside the nav/sidebar DOM
  subtree) and `SidebarFocusToggle.vue` into `nav-bar-content-after`.
- `apps/docs-web/.vitepress/theme/custom.css` — the collapse CSS rules
  (`--vp-sidebar-width` zeroing, aside `display: none` + relaxed
  `content-container` max-width, nav-title overflow fix, `transition: none`
  overrides, and the flexbox `order` reorder that moves the focus button
  next to the theme switch).

### Renamed

None.

### Deleted

None.
