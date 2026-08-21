# Patch 0026 — claude-desktop-setup-for-managers

## Summary

Adds a full onboarding + working path for non-technical engagement managers to run `/discovery` directly against the repo from **Claude Desktop** (its Code tab), instead of only Claude Code + IDE — architects keep `/design`/`/dev` in Claude Code, managers get their own guided path with the same guarded-command safety model.

- New `docs/AI SDLC/01 Process/09 Claude Desktop Setup.md`: Prerequisites (git/Claude accounts + downloads) → Env setup (clone, run the OS setup script) → Tool setup (Code tab, working directory) → Contribution guide (`/discovery`, free-form prompts, previewing the site, opening a PR) → Use cases (situation → example `/discovery` prompt, mapped to the engagement lifecycle) — illustrated throughout with real Claude Desktop screenshots (each captioned to explain the red-arrow callouts).
- New `docs/AI SDLC/01 Process/10 Branching Policy.md`: trunk-based model (`main` + short-lived feature branches, gitGraph diagram), a prompt table for starting new work (new session → branch picker → "pull latest version of the repo"), and an "after opening a PR" section covering watching CI and asking Claude to fix failures (e.g. deadlinks) before merge.
- New `scripts/setup/setup-mac.sh` / `scripts/setup/setup-windows.ps1`: functional-style (`main`/`Main` orchestrator) machine bootstrap — installs git, Node (via nvm, from `.nvmrc`), corepack/Yarn, and optionally `gh` (installer step and `gh auth login` both gated behind a `confirm`/`Confirm-Action` helper defaulting to "no"), then `yarn install --immutable`. Fully self-installing (bootstraps Homebrew/winget as needed) rather than printing "go install this yourself" instructions.
- New `.claude/launch.json`: named launch configs (`site`, `commit`, `push`, `pull`, `checkout-main`) so Claude Desktop/Code can run these directly without the developer typing git.
- `.claude/settings.json`: removed `git push` from the permissions deny list (it was a hard block with no prompt) and added an `autoMode.allow` entry (with `"$defaults"` preserved) so the Auto-mode classifier stops soft/hard-denying `git commit`/`git push` in this repo — both still require per-action approval (a permission prompt in Claude Code, the **Create PR** button in Claude Desktop), just not a categorical block.
- `CLAUDE.md`: split the "Guarded commands" rule — `cdk deploy`/`infra:provision` stay guarded (never run directly); `git push` gets its own line noting it now runs after explicit per-action approval, never silently. Also adds a **Default scope** rule: an ambiguous prompt defaults to `docs/AI SDLC/` unless another location is named explicitly.
- `docs/AI SDLC/01 Process/05 Team Collaboration.md`: "Who uses what" table and diagram updated for the new model (Claude Desktop/managers/`/discovery` vs Claude Code/architects/`/design`·`/dev`), replacing the old "non-technical members draft outside the repo, no access required" framing; guarded-commands closing line updated to match the `git push` policy change above.
- `docs/AI SDLC/01 Process/index.md`: nav rows added for the two new pages.
- `apps/docs-web/package.json` + `package.json` + `yarn.lock`: bumped `mermaid` → `^11.17.0` and `eslint`/`@eslint/js` → `^10.9.0`/`^10.0.1` to clear moderate `yarn npm audit` findings (mermaid CVEs fixed in 11.16.1+; the eslint 9.x line is EOL). `typescript-eslint@8.67.0` already declares peer support for `eslint ^10.0.0`, no further cascading bump needed.
- `apps/docs-web/.vitepress/config.ts`: added `vite.optimizeDeps.include` for `mermaid`/`fastdom`/`fastdom/extensions/fastdom-promised.js` — needed after the mermaid bump.
- **`[[GITHUB_ORG]]` / `[[GITHUB_REPO]]` placeholders**: `09 Claude Desktop Setup.md`'s `git clone` command and working-directory instruction use these two new bracket placeholders (same convention as `[[CLIENT_NAME]]`) instead of this repo's own hardcoded `DataArt/adlc-discovery-tool`. `scripts/bootstrap/bootstrap-client.mts`'s Step 1 find-replace is generalized (`replaceClientNameToken` → `replaceTokens`) to resolve `[[CLIENT_NAME]]`, `[[GITHUB_ORG]]`, and `[[GITHUB_REPO]]` in one pass, reusing the org/repo values `/bootstrap-client` Section 2.3 already collects — no new prompts added. `.claude/skills/bootstrap-client/SKILL.md` Section 2.3 gets a one-line pointer explaining why those values also matter here. **If applying this patch to an already-bootstrapped target repo** (not running `/bootstrap-client` fresh), `/patch-apply`'s Step 4 placeholder-resolution will catch `[[GITHUB_ORG]]`/`[[GITHUB_REPO]]` as unresolved bracket placeholders and ask for that repo's real values — same as it already does for `[[CLIENT_NAME]]`.

**Excluded from this bundle**: `docs/Engineering Guide/08 Branching Strategy.md` — a Git-Flow reference doc adapted from an unrelated product's Confluence space (develop/release/hotfix branches, semantic-release, a Performance environment), not generic starter-kit material.

## Added

- `.claude/launch.json`
- `docs/AI SDLC/01 Process/09 Claude Desktop Setup.md`
- `docs/AI SDLC/01 Process/10 Branching Policy.md`
- `docs/public/images/process/claude-desktop-ci-green.png`
- `docs/public/images/process/claude-desktop-ci-status.png`
- `docs/public/images/process/claude-desktop-code-tab.png`
- `docs/public/images/process/claude-desktop-create-pr.png`
- `docs/public/images/process/claude-desktop-new-session-branch.png`
- `docs/public/images/process/claude-desktop-preview-site.png`
- `docs/public/images/process/claude-desktop-pull-latest.png`
- `docs/public/images/process/claude-desktop-status-and-pr.png`
- `scripts/setup/setup-mac.sh`
- `scripts/setup/setup-windows.ps1`

## Updated

- `.claude/settings.json`
- `.claude/skills/bootstrap-client/SKILL.md`
- `CLAUDE.md`
- `apps/docs-web/.vitepress/config.ts`
- `apps/docs-web/package.json`
- `docs/AI SDLC/01 Process/05 Team Collaboration.md`
- `docs/AI SDLC/01 Process/index.md`
- `package.json`
- `scripts/bootstrap/bootstrap-client.mts`
- `yarn.lock`

## Renamed

None.

## Deleted

None.
