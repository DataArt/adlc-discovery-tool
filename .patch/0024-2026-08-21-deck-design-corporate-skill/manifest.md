# Patch 0024 — deck-design-corporate-skill

## Summary

Adds the `deck-design-corporate` skill — a slide-deck builder that composes DataArt "Corporate"-branded decks (1920×1080, Arial) from a bundled kit of ~30 pixel-faithful HTML templates (covers, section dividers, content layouts, process/timeline constructors, a showcase page), CSS design tokens/layouts/components, SVG/PNG/JPG brand assets (logos, icons, backgrounds, office photos, partner logos), a PPTX export pipeline (Python scripts + a master template), and verification tooling (headless render checks, copy-budget checks, migration-coverage checks). Triggers whenever the user asks for a DataArt deck/presentation/slides. `eslint.config.js` now ignores `.claude/skills/**` so the skill's vendored Python/JS scripts (e.g. `scripts/lib/slide-checks.js`) aren't linted as project source.

## Added

174 files under `.claude/skills/deck-design-corporate/` — full skill package: SKILL.md, CHANGELOG.md, agent reference docs, the kit-corporate/ asset+template library (assets/backgrounds, assets/chapter, assets/graphics, assets/icons, assets/logo, pptx/, shared/ CSS, showcase/, templates/), reference docs, and scripts/ (Python export/verify/materialize tooling + one JS lint-check script). See `files/.claude/skills/deck-design-corporate/` for the full tree — paths mirror the repo exactly.

<details>
<summary>Full file list (174 files)</summary>

- `.claude/skills/deck-design-corporate/CHANGELOG.md`
- `.claude/skills/deck-design-corporate/SKILL.md`
- `.claude/skills/deck-design-corporate/agent/references/aims-judgement.md`
- `.claude/skills/deck-design-corporate/agent/references/data/ux-guidelines.csv`
- `.claude/skills/deck-design-corporate/agent/references/execution-checkpoints.md`
- `.claude/skills/deck-design-corporate/agent/references/ux-guidelines.md`
- `.claude/skills/deck-design-corporate/deck-design-corporate.md`
- `.claude/skills/deck-design-corporate/deck-design-corporate.skill`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-content-01.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-content-02.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-content-03.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-content-04.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-content-05.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-content-06.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-content-07.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-content-08.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-cover-light.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-title-01.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-title-02.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-title-03.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-title-04.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-title-05.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/backgrounds/bg-title-06.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/01.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/02.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/03.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/04.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/05.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/06.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/07.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/08.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/chapter/09.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/cap-build.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/cap-innovate.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/cap-modernize.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/cap-operate.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/fastfacts-map.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/industries/finance.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/industries/healthcare.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/industries/insurance.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/industries/media.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/industries/retail.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/industries/travel.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/offices/dubai.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/offices/london.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/offices/munich.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/offices/newyork.jpg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/adobe.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/aws.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/databricks.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/googlecloud.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/hubspot.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/microsoft.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/salesforce.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/snowflake.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/graphics/partners/stripe.png`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/arrow-flow-wide.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/arrow-flow.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/arrow-head.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/arrow-square.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/icon-finance.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/icon-sample-1.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/icon-sample-2.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/add-user.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/ai-brain.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/automation-robot.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/certificate.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/chart-bar.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/chart-growth.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/chart-pie.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/chat.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/clock.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/cloud.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/code-window.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/cpu-chip.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/discovery-search.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/globe.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/goal-target.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/infinity-continuous.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/innovation-wand.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/integration-puzzle.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/iot-circuit.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/knowledge-sharing.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/mail.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/maintenance-tools.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/manifest.json`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/network-nodes.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/partnership-handshake.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/privacy-lock.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/quality-seal.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/responsive-devices.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/security-shield.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/server.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/settings-gear.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/task-list.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/team.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/terminal.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/user.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/icons/library/workflow.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/logo/dataart-logo-large-white.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/logo/dataart-logo-large.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/logo/dataart-logo-small-white.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/assets/logo/dataart-logo-small.svg`
- `.claude/skills/deck-design-corporate/kit-corporate/pptx/dataart-corporate-template.pptx`
- `.claude/skills/deck-design-corporate/kit-corporate/pptx/master-txstyles.xml`
- `.claude/skills/deck-design-corporate/kit-corporate/shared/components.css`
- `.claude/skills/deck-design-corporate/kit-corporate/shared/layouts.css`
- `.claude/skills/deck-design-corporate/kit-corporate/shared/tokens.css`
- `.claude/skills/deck-design-corporate/kit-corporate/showcase/index.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/asis-capabilities.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/asis-contacts.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/asis-fastfacts.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/asis-microsoft.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/asis-partnerships.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-cards.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-comparison.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-framework.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-icon-cards.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-icon-grid.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-icon-list.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-list-tagged.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-logo-grid.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-media.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-milestone-timeline.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-nextsteps.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-numbered-boxes.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-numbered-icon-cards.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-phase-timeline.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-pipeline-comparison.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-pipeline.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-placeholder.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-plan-table.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-process.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-split.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-sprint-roadmap.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-stacked-list.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-stats-map.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-table.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-team-roles.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-team.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-text-media.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/content-timeline.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/cover-2logo.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/cover.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/final.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/quote.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/section-divider.html`
- `.claude/skills/deck-design-corporate/kit-corporate/templates/statement.html`
- `.claude/skills/deck-design-corporate/manifest.json`
- `.claude/skills/deck-design-corporate/references/aims64-handoff.md`
- `.claude/skills/deck-design-corporate/references/canvas-zones.md`
- `.claude/skills/deck-design-corporate/references/composition-rules.md`
- `.claude/skills/deck-design-corporate/references/cowork-adaptations.md`
- `.claude/skills/deck-design-corporate/references/deck-migration.md`
- `.claude/skills/deck-design-corporate/references/kit-map.md`
- `.claude/skills/deck-design-corporate/references/narrative-arc.md`
- `.claude/skills/deck-design-corporate/references/pptx-export.md`
- `.claude/skills/deck-design-corporate/references/verification.md`
- `.claude/skills/deck-design-corporate/scripts/build-master-template.py`
- `.claude/skills/deck-design-corporate/scripts/check-copy-budget.py`
- `.claude/skills/deck-design-corporate/scripts/check-migration-coverage.py`
- `.claude/skills/deck-design-corporate/scripts/export-pptx.py`
- `.claude/skills/deck-design-corporate/scripts/export-pptx.sh`
- `.claude/skills/deck-design-corporate/scripts/extract-source-deck.py`
- `.claude/skills/deck-design-corporate/scripts/find-kit.sh`
- `.claude/skills/deck-design-corporate/scripts/kit-overview.sh`
- `.claude/skills/deck-design-corporate/scripts/lib/install-editable-pptx.command`
- `.claude/skills/deck-design-corporate/scripts/lib/slide-checks.js`
- `.claude/skills/deck-design-corporate/scripts/materialize-deck.sh`
- `.claude/skills/deck-design-corporate/scripts/materialize-slide.sh`
- `.claude/skills/deck-design-corporate/scripts/resolve-output-dir.sh`
- `.claude/skills/deck-design-corporate/scripts/verify-deck-headless.py`
- `.claude/skills/deck-design-corporate/scripts/verify-deck.sh`
- `.claude/skills/deck-design-corporate/scripts/verify-slide.sh`

</details>

## Updated

- `eslint.config.js` — adds `.claude/skills/**` to the ESLint ignore list

## Renamed

_None._

## Deleted

_None._

## Notes for the applying repo

- This is a large binary-heavy bundle (~8.7MB) — mostly JPG/PNG background and photo assets plus one PPTX template. Nothing here is client-specific; safe to apply as-is to any sibling repo built from this starter kit.
- If the target repo already has a different ESLint ignore list, merge the `.claude/skills/**` entry in rather than overwriting the whole file.
- Deliberately excludes two files that were staged alongside this skill in the source repo but are NOT part of it: `decks/.gitignore` and a client-specific `docs/AI SDLC/02 Capture/Gate 1 (Steering Meeting) - 25 August 2026/Agenda.md` naming real stakeholders for one client engagement. Do not carry those into another client's repo.
