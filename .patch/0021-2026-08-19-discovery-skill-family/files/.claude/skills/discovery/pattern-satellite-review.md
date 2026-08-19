# Pattern: Satellite Review (Discovery)

After a stage skill publishes an evidence-bearing artifact, or the root assembles a package for a gate, invoke `@discovery` as a read-only reviewer before presenting the result to the engagement lead.

`@discovery` no longer owns the discovery flow — the `discovery`/`discovery-investigate`/`discovery-*` skills do. Its remaining job is to check that what a skill is about to publish actually honours [04 Evidence Chain](/AI%20SDLC/01%20Process/04%20Evidence%20Chain.md), the same way `@architect` checks structural soundness for `/design`.

## When to trigger

- After `discovery-investigate-vision-current-state` publishes or updates a Current State page
- After `discovery-investigate-problem-sdlc-domains` publishes or updates an SDLC Domain page
- After `discovery-investigate-problem-diagnose` publishes or updates a Problems registry entry (including a status move, e.g. 🟡 → 🟢)
- After `discovery-investigate-goals-solution-goals` publishes or updates a Solution Goals draft
- After the root assembles the consolidated findings package for Gate Review, before it's presented to stakeholders

Skip for: workshop `Agenda.md` drafts (not yet evidence — nothing to check against), and `Where We Are`/`Report Log` status-table refreshes (mechanical bookkeeping, not a new evidentiary claim).

## Review protocol

1. Stage skill completes the artifact
2. Invoke `@discovery` with a read-only prompt scoped to the artifact — **"Do not write or edit any files — return output only"** — asking it to check:
   - **Citation** — the Changelog row cites the workshop, session, or conversation this derives from, not just a date
   - **Status ladder** — a Problem only moves 🟡 → 🟢 on a second, independent source, and only to 🔵 on a number backing the impact claim; nothing is marked Confirmed on a single source
   - **Wiring** — the artifact is reachable from what it derives from and vice versa (e.g. an SDLC Domain page traces back to the Current State evidence that fed it)
   - **Claim strength** — nothing in the artifact asserts more than the cited evidence actually supports
3. If **OK / no issues**: present the result to the engagement lead and continue
4. If **corrections needed**: apply corrections, then re-invoke once more
5. **Maximum 2 iterations.** If still unresolved, report the stalemate to the engagement lead and stop

## Why

A gap in the evidence chain is cheapest to catch at the point an artifact is published — a Problem marked Confirmed on one source, or an SDLC Domain page that doesn't trace back to the workshop it came from, otherwise surfaces only at Gate Review, when it can flag an item for re-evaluation and cascade a re-open back through everything downstream of it.
