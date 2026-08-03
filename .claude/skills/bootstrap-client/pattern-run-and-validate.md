# Pattern: Run and Validate

Every command that mutates state or touches an external/credentialed system (GitHub, AWS, git remotes) is presented as an instruction for the developer to run in their own terminal — never executed by Claude directly, regardless of how safe or routine it looks.

**Exception:** local, read-only checks against files already on disk in this repo (e.g. `git remote -v`, `grep` for a token, checking whether a file exists) — Claude can run these directly to validate a stage's outcome. The line is mutating/external vs. local/read-only, not "looks safe."

## Loop, per step

1. Print the exact command(s) in a fenced code block, plus what a successful result looks like.
2. **Stop and wait** for the developer to run it in their own terminal.
3. Ask them to paste back the output (or confirm completion, for steps with no meaningful output — e.g. a UI checkbox).
4. Validate against the expected result:
   - Matches → mark the step `✅` in `report.md`, move on.
   - Doesn't match / error → diagnose from the pasted output, propose a fix, do not guess silently or retry blindly.
5. Update `report.md`'s Progress table for this step before moving to the next.

## Why

Earlier in this starter kit's own bootstrap testing, Claude ran the deterministic apply script directly (with `yarn --cwd <repo>`) instead of asking the developer to run it — a `--cwd` mistake silently redirected it back to the real repo without `--dry-run`, applying test client values ("Acme Corp") for real across ~45 tracked files. The fix required a manual `git stash` to recover. Handing every mutating command to the developer removes this whole class of risk — Claude can misjudge a flag or a working directory, the developer running their own terminal cannot make that particular mistake on Claude's behalf. It also leaves a persistent, accurate record (`report.md`) instead of relying on conversation scrollback, which compacts and is lossy across sessions.
