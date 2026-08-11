# Pilot

> [!WARNING] Populated During Engagement
> Ideas below are provisional — grounded in [Problem Space](/AI%20SDLC/03%20Problem%20Space/) findings as they mature, not commitments. This page is a starting shape, not a decision.

> Prove the model on one real workload — fixed scope, time-boxed.

---

## Define the Pilot Workload

| Candidate   | Rationale   | Evidence                             |
| ----------- | ----------- | ------------------------------------ |
| [CANDIDATE] | [RATIONALE] | [Problem Space — relevant Area link] |

## Set Up an AI-Assisted Process & Toolset

- Build on [[CLIENT_NAME]]'s existing AI infrastructure where one exists, rather than standing up parallel infrastructure — check [Problem Space → Current State](/AI%20SDLC/03%20Problem%20Space/Current%20State/) for what's already there.
- Guardrails sized to whichever candidate is chosen — e.g. read-only agent access first if the pilot touches source code or sensitive content.
- A minimal data classification baseline (e.g. public / internal / restricted / regulated) for whatever the pilot touches — not a full framework. See [Problem Space — Governance](/AI%20SDLC/03%20Problem%20Space/10%20Governance).

## Set Up a Knowledge Base Scoped to the Workload (Phased)

- Start with just the context the pilot workload needs, not an estate-wide rollout — draw on whatever ingestion or integration work is already underway or already planned, rather than waiting for all of it.
- Phase it: raw ingestion → curated/structured context → validated against the pilot's actual output quality.

## Educate the Team

- The team running the pilot needs to understand the new process, not just be handed new tools — pairing or embedded support during the pilot, not a one-off training session.
- Capture what's learned as the pilot runs, not only at the end — this is what [Evolve](./04%20Evolve.md) feeds on.

## Open Questions

- Which candidate has the clearest path to a visible proof point inside the fixed Solution Design window?
- Does the chosen pilot need Compliance/Security in the room before it can start, or can Pilot begin without them?
- How much of the scoped knowledge base can realistically be built and validated inside the pilot's own timebox?
