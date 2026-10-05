# Pattern: Session continuity

On entry or after compaction, read the root `SKILL.md`, current reference, relevant
standing status page, and latest Report Log entries. Preserve the requested entry
mode (full chain or direct unit), session subject, gate number, active step,
caller, pending decisions, and evidence paths. Record unfinished work and its next
action in the appropriate standing status page before ending a session.

Return only to the recorded caller: an Investigate child returns to its session;
a full-chain phase returns to the root. Direct entry ends after its requested unit,
including direct Investigate sessions. Never reconstruct a full-chain caller merely
because a reference mentions the root. When state is incomplete, ask for the missing
subject or decision rather than treating a prior draft as approved.
