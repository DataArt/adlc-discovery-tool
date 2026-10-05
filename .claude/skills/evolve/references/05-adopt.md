# Adopt

## Responsibility and completion

Publish the accepted, validated candidate into the local harness and integrate its
callers, discovery entries and documentation. Completion requires verified installed
content and integration evidence. Failed integration stays incomplete with recovery
details; it must not be reported as an adopted improvement.

## Procedure

Read the candidate report and validation evidence under
`.claude/evolve/{timestamp}-{slug}/`. Require a passing verdict for the current
candidate hashes, matching destination baselines and acceptance of the concrete
change (reuse existing authorization). If the active owner has changed, reconcile in
Draft and revalidate; do not overwrite concurrent changes.

Apply the recorded additions, updates and explicit retirements to the local harness.
Install slash-command skills as `.claude/skills/{name}/SKILL.md` and copy their
selected companions; install agents as `.claude/agents/{name}.md`. Update relevant
callers, the `## Skills`/`## Agents` discovery tables in `CLAUDE.md`, and the
lifecycle documentation under `docs/Engineering Guide/Lifecycles/` (notably
`03 Skill Lifecycle.md`). Retire replaced entry points only after checking callers;
preserve unrelated files and the candidate evidence for rollback.

Verify installed content matches the validated candidate, local references resolve,
and affected callers reach the new entry point. Record results before marking Adopt
complete. If integration fails, record the partial state and restore owned changes
where safe; do not report success or erase concurrent edits.

Record verified adoption in the candidate report and close the lifecycle.
