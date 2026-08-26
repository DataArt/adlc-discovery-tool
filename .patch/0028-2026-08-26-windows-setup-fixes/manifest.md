# Patch 0028 — windows-setup-fixes

## Summary

Fixes a chain of Windows-checkout and Windows-setup-script breakages surfaced while onboarding a non-technical engagement manager via Claude Desktop (see `09 Claude Desktop Setup.md`, patch 0026). Root causes, in order:

1. **NTFS forbids `:` in filenames** — two diagram images (`AI Factory: From Intent to Confuse.png`, `Context Foundation: Stable Tools vs. Broken Migration.png`) used a colon after the leading word, which crashes `git checkout`/`git clone` on Windows. Both are renamed to use `-` instead, with every Markdown reference and every patch-bundle copy of those files/references updated to match.
2. **Cross-platform line-ending/binary handling wasn't declared** — no `.gitattributes` existed, so line endings and binary files (images, fonts) had no explicit normalization rule across platforms. Added one: `text=auto eol=lf` by default, `*.ps1` forced to `eol=crlf` (PowerShell's default line ending), and common binary extensions (`png`, `jpg`, `jpeg`, `gif`, `ico`, `pdf`, `woff`, `woff2`, `ttf`, `eot`) marked `binary` so git never attempts to diff or convert them.
3. **PowerShell 5.1 misreads non-ASCII bytes in BOM-less `.ps1` files via the system codepage** — `scripts/setup/setup-windows.ps1` used em-dashes (`—`) in `Write-Host` strings and comments, which render as mojibake or throw parse errors on a non-UTF-8 codepage. All em-dashes replaced with ASCII hyphens (`-`). Mirrored in the `.patch/0026-.../files/scripts/setup/setup-windows.ps1` bundle copy.
4. **nvm-windows silently no-ops without admin rights** — creating the Node version symlink needs elevation; running the script from a non-elevated shell previously failed with no clear signal. `setup-windows.ps1` gains a `Test-IsAdmin` helper, an upfront warning in `Main` if the shell isn't elevated, and a check after `nvm use` that fails loudly (with a re-run-elevated instruction) if `node` still isn't on PATH. Mirrored in the `.patch/0026-.../files/scripts/setup/setup-windows.ps1` bundle copy.
5. **Doc didn't warn users upfront** — `docs/AI SDLC/01 Process/09 Claude Desktop Setup.md`'s Windows setup step now tells the reader to open PowerShell as Administrator before running the script, so the script's new warning (point 4) is a fallback rather than the first time the user hears about elevation. Mirrored in the `.patch/0026-.../files/docs/AI SDLC/01 Process/09 Claude Desktop Setup.md` bundle copy.

**Why the `.patch/00xx-.../files/...` copies are included**: several older, not-yet-applied-everywhere patch bundles (0010, 0014, 0018, 0026) snapshot the affected files as of their own prepare time. Since the underlying files were renamed/edited at the root, those bundle-internal snapshots would otherwise apply the stale colon-filename or pre-fix script/doc content to any repo that runs `/patch-apply` on them later. Their copies are updated here so applying any of those older bundles after this one lands still produces a consistent result. Their `manifest.md` files (0010, 0014) also needed the `Renamed` filename fixed for the same reason.

## Added

- `.gitattributes`

## Updated

- `docs/The Story/01 From Broken Handoffs to Governed AI.md`
- `docs/The Story/03 Challenges.md`
- `docs/AI SDLC/01 Process/09 Claude Desktop Setup.md`
- `scripts/setup/setup-windows.ps1`
- `.patch/0010-2026-08-12-context-challenges-images/files/docs/Context/02 Challenges.md`
- `.patch/0010-2026-08-12-context-challenges-images/manifest.md`
- `.patch/0014-2026-08-16-story-restructure/files/docs/The Story/01 From Broken Handoffs to Governed AI.md`
- `.patch/0014-2026-08-16-story-restructure/files/docs/The Story/03 Challenges.md`
- `.patch/0014-2026-08-16-story-restructure/manifest.md`
- `.patch/0018-2026-08-18-problem-space-restructure/files/docs/The Story/03 Challenges.md`
- `.patch/0026-2026-08-21-claude-desktop-setup-for-managers/files/docs/AI SDLC/01 Process/09 Claude Desktop Setup.md`
- `.patch/0026-2026-08-21-claude-desktop-setup-for-managers/files/scripts/setup/setup-windows.ps1`

## Renamed

- `docs/public/images/context/AI Factory: From Intent to Confuse.png` → `docs/public/images/context/AI Factory - From Intent to Confuse.png`
- `docs/public/images/context/Context Foundation: Stable Tools vs. Broken Migration.png` → `docs/public/images/context/Context Foundation - Stable Tools vs. Broken Migration.png`
- `.patch/0010-2026-08-12-context-challenges-images/files/docs/public/images/context/Context Foundation: Stable Tools vs. Broken Migration.png` → `.patch/0010-2026-08-12-context-challenges-images/files/docs/public/images/context/Context Foundation - Stable Tools vs. Broken Migration.png`
- `.patch/0014-2026-08-16-story-restructure/files/docs/public/images/context/AI Factory: From Intent to Confuse.png` → `.patch/0014-2026-08-16-story-restructure/files/docs/public/images/context/AI Factory - From Intent to Confuse.png`

## Deleted

None.
