# Changelog

All notable changes to the **deck-design-corporate** skill are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/); versions follow semver.

## [1.0.0] — 2026-07-02

First stable release of the DataArt Corporate deck skill: brief → HTML slides
on the Corporate Slides Kit → editable, branded PPTX.

### Added

- **Branded slide master.** Every exported deck now ships a real DataArt
  PowerPoint master — official corporate typography (44 pt title, 9-level
  body ramp, white logo on dark) — plus 15 reusable layouts in the Layout
  menu (covers, dividers, 1–4 column grids, numbered cards, comparison,
  timeline, process, table), so decks can be extended by hand in-brand.
- **New template constructors.** Kit grown to 39 pixel-faithful templates:
  strategic framework, icon-block grid, milestone / phase / sprint timelines,
  pipeline comparison, next-steps roadmap, plan table and more.
- Standalone `.skill` bundle with the kit and shared references included —
  installs and runs without the monorepo.

### Changed

- **Text and icons are no longer embedded pixels.** Slide text exports as
  native, editable PowerPoint runs (Arial, kit sizes, Chromium-exact line
  breaks); template icons come from the shared SVG icon library instead of
  baked PNGs.
- Kit re-based from 1440×810 to the full 1920×1080 canvas — tokens, layouts,
  templates, showcase and export grid all aligned to Figma-exact coordinates.

### Performance

- Deck build is **2.5–3.2× faster**: batch slide materialisation, one-pass
  headless verification, removal of per-slide network-idle waits.
- Exported PPTX is **~72% smaller** (9.5 → 2.6 MB): JPEG backgrounds,
  raster cap at 1920 px, downscaled master backgrounds.
