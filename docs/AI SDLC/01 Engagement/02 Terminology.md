---
aside: false
---

# Terminology

_The vocabulary this engagement's evidence chain runs on — Capture, Workshop, Current State, Problem, Diagnose, Claims, and the rest. Distinct from [03 Process — Terminology](./03%20Process/02%20Terminology.md)'s **Phase / Stage / Artifact** vocabulary, which describes the container structure these terms live inside, not what they mean. Read this once and the rest of `docs/AI SDLC/` stops needing to be reverse-engineered from context. Static — doesn't change during the engagement._

## Core Vocabulary

| Term                 | Meaning                                                                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Capture**          | The Investigate stage that builds a shared, evidenced picture of today's SDLC — the workshop programme plus the Current State it produces. See [02 Capture](/AI%20SDLC/02%20Capture/).                                                       |
| **Workshop**         | A calendar event with the client. Target: one session, ≤2 hours. Has its own folder with an Agenda, Notes, Outcomes, and a Transcript — only Agenda exists ahead of a live session.                                                          |
| **Session**          | A continuous facilitated block within a workshop — almost always one per workshop; a workshop occasionally runs two if scheduling forces a split.                                                                                            |
| **Topic**            | A specific thread on a session's agenda, tagged to the SDLC Domain it's diagnosing.                                                                                                                                                          |
| **SDLC Domain**      | One of 10 fixed diagnostic domains (Requirements & Stories, Design & UX, DevOps & Pipeline, ... Governance). Every workshop topic belongs to exactly one; every domain has a waiting [Problem Space](/AI%20SDLC/03%20Problem%20Space/) page. |
| **Current State**    | The evidenced baseline of today's SDLC — Process, Architecture, Context Topology, AI Adoption, Metrics, Tool Inventory, Inhouse Initiatives. Built by Capture, cited by everything downstream.                                               |
| **Problem**          | A diagnosed root cause, ranked by impact on delivery speed, carried on the Problems registry with a status ladder: 🟡 Reported → 🟢 Confirmed → 🔵 Measured (or ⚫ Retracted).                                                               |
| **Diagnose**         | The act of turning SDLC Domain evidence into a Problem — the second half of the Problem stage, once SDLC Domain evidence exists to diagnose against.                                                                                         |
| **Claims**           | The append-only ledger of raw quotes behind every Problem — one row per claim, never edited once written. Several claims on the same Problem ID, from different workshops, is what corroborates it.                                          |
| **Strategic Intent** | The raw trigger for the engagement, captured close to verbatim at Gate 0 — a blunt statement of spend, ambition, or discomfort, not yet a scored objective.                                                                                  |
| **Solution Goals**   | The grounded, evidenced version of Strategic Intent, narrowed to what Problem has actually diagnosed a root cause for.                                                                                                                       |
| **Gate**             | A checkpoint that closes only when its entry criteria hold, evidenced — not a scheduled ceremony. Four gates bound the engagement's three phases.                                                                                            |
| **Target State**     | The concrete end-state picture the Solution phase works toward, grounded in Strategic Intent and Solution Goals. First of a closed loop: Target State → Pilot → Scale → Evolve.                                                              |
| **Pilot**            | The one slice of Target State the team commits to proving first — not picked independently of Target State, but the piece of it that gets built and tested.                                                                                  |
| **Scale**            | Extends what Pilot proved beyond its original slice, once the pilot has demonstrated the pattern works.                                                                                                                                      |
| **Evolve**           | Closes the Target State → Pilot → Scale loop — feeds what Scale and Pilot learned back into Pilot, and refines Target State itself.                                                                                                          |

## How These Fit Together

Strategic Intent sets the target upfront. Workshops (Capture) validate it and build Current State. SDLC Domain evidence gets Diagnosed into Problems, each backed by Claims. Problems and Strategic Intent together ground Solution Goals. Solution Goals anchor Target State, which Pilot proves a slice of, Scale extends, and Evolve feeds back into. Everything traces back through this chain to a workshop or a conversation — nothing is asserted without a link upstream.

→ [04 Evidence Chain](./03%20Process/04%20Evidence%20Chain.md) for the diagram of how these pieces connect into a pipeline, and the rules that keep it one-way. → [03 Process — Terminology](./03%20Process/02%20Terminology.md) for Phase / Stage / Artifact — the container structure these terms live inside, and where each one's page actually lives.
