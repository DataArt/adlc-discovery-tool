---
outline: [2, 3]
---

# 🎯 Solution Goals

> Of what we set out to achieve, what's actually evidenced and worth engineering a solution against?

Where [Strategic Intent](./02%20Strategic%20Intent.md) is raw and unshaped, this is the grounded version: achievable within a stated horizon (short/mid/long term), wired to the piece of Intent that justifies it, checked against any [Inhouse Initiative](/AI%20SDLC/02%20Capture/02%20Inhouse%20Initiatives/Overview.md) already running, grounded in [Current State](/AI%20SDLC/02%20Capture/01%20Current%20State/Process.md) as it actually stands today, and narrowed to what [Problem Space](/AI%20SDLC/03%20Problem%20Space/) has actually evidenced. A goal without a diagnosed problem behind it has no evidence it's the right thing to solve; a goal that duplicates or contradicts an existing internal initiative isn't grounded either; a goal that doesn't check against Current State risks solving something that's already true — this page is where all four filters get applied, in the same step as grounding it. [Solution Space](/AI%20SDLC/05%20Solution%20Space/)'s Target State and coverage matrix are checked against this list, not the raw Intent.

> [!WARNING] Populated During Engagement
> This page is a placeholder until Problem Space root causes hold steady. It is drafted once the picture is clear enough to say, with evidence, which pieces of Strategic Intent are achievable, by when, and in what order — then validated with stakeholders alongside the Problem Space findings that support them.

---

## Reading the Registry

Every goal gets an ID the day it's first drafted, and keeps it for the life of the engagement — IDs are never reused. Status only moves forward; a goal dropped from scope is marked **Cut** with the reason kept, not deleted.

| Status       | Meaning                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------- |
| 🔄 Shaped    | Drafted and grounded against Problem Space evidence — not yet validated with stakeholders |
| ✅ Confirmed | Validated with stakeholders                                                               |
| 🚫 Cut       | Dropped from scope; reason kept for the record, ID not reused                             |

---

## Registry

> [!NOTE] Illustrative Placeholders
> The entries below carry over the same common-goal patterns used to prompt [Strategic Intent](./02%20Strategic%20Intent.md)'s starting conversation — a shape for the list, not [[CLIENT_NAME]]'s confirmed list. Replace them entirely once Problem Space evidence exists; every real entry must trace to all four fields, not just read plausibly.

| ID    | Goal                      | Horizon    | Priority | Status    |
| ----- | ------------------------- | ---------- | -------- | --------- |
| SG-01 | AI-legible codebase       | Mid-term   | [TBD]    | 🔄 Shaped |
| SG-02 | Estate-wide coherence     | Mid-term   | [TBD]    | 🔄 Shaped |
| SG-03 | AI-aware governance       | Short-term | [TBD]    | 🔄 Shaped |
| SG-04 | Attributed AI spend       | Short-term | [TBD]    | 🔄 Shaped |
| SG-05 | Tool-agnostic foundations | Long-term  | [TBD]    | 🔄 Shaped |

---

## SG-01 — AI-legible codebase

**Goal:** Capture architectural context, integration patterns, and conventions in a form AI tools (and new engineers) can actually read and act on.

**Horizon:** Mid-term

**Traces to Strategic Intent:** An ambition ahead of readiness (autonomous agents) and a headcount bet already made both fail without this — neither works against a codebase only humans can navigate.

**Traces to Inhouse Initiative:** Check against any existing knowledge-base or context-ingestion effort — don't stand up a second one.

**Current State Evidence:** [TBD — link to [Architecture](/AI%20SDLC/02%20Capture/01%20Current%20State/Architecture.md) / [Tool Inventory](/AI%20SDLC/02%20Capture/01%20Current%20State/Tool%20Inventory.md) showing what context already exists and in what form]

**Evidence (Problem Space):** [TBD — Problem Space domain link]

**Priority:** [TBD]

**Status:** 🔄 Shaped — illustrative placeholder, not yet drafted against real evidence

---

## SG-02 — Estate-wide coherence

**Goal:** Converge on shared tools, patterns, and standards for AI-assisted output before local divergence compounds.

**Horizon:** Mid-term

**Traces to Strategic Intent:** A headcount bet already made needs AI output trustworthy at scale, not just in the one team that happens to do it well.

**Traces to Inhouse Initiative:** Respect any tooling standard the initiative has already mandated org-wide.

**Current State Evidence:** [TBD — link to [Tool Inventory](/AI%20SDLC/02%20Capture/01%20Current%20State/Tool%20Inventory.md) showing where tools/patterns already diverge across teams]

**Evidence (Problem Space):** [TBD — Problem Space domain link]

**Priority:** [TBD]

**Status:** 🔄 Shaped — illustrative placeholder, not yet drafted against real evidence

---

## SG-03 — AI-aware governance

**Goal:** Establish governance that covers what AI tools can read, generate, and where that data flows, scoped to the organisation's actual risk surface.

**Horizon:** Short-term

**Traces to Strategic Intent:** Spend without a return read usually surfaces a governance gap alongside the cost gap — nobody can say what's allowed, so nobody can say what's working.

**Traces to Inhouse Initiative:** Build on any existing AI governance policy rather than drafting a parallel one.

**Current State Evidence:** [TBD — link to [Process](/AI%20SDLC/02%20Capture/01%20Current%20State/Process.md) / [Tool Inventory](/AI%20SDLC/02%20Capture/01%20Current%20State/Tool%20Inventory.md) showing what governance controls, if any, already exist]

**Evidence (Problem Space):** [TBD — Problem Space domain link]

**Priority:** [TBD]

**Status:** 🔄 Shaped — illustrative placeholder, not yet drafted against real evidence

---

## SG-04 — Attributed AI spend

**Goal:** Give leadership a clear view of AI cost against delivery output, by team and workload.

**Horizon:** Short-term

**Traces to Strategic Intent:** Directly answers spend without a return read — the gap has to be visible before it can be closed.

**Traces to Inhouse Initiative:** Align with any existing cost/observability tooling the initiative already runs.

**Current State Evidence:** [TBD — link to [Tool Inventory](/AI%20SDLC/02%20Capture/01%20Current%20State/Tool%20Inventory.md) showing what cost/usage visibility, if any, already exists]

**Evidence (Problem Space):** [TBD — Problem Space domain link]

**Priority:** [TBD]

**Status:** 🔄 Shaped — illustrative placeholder, not yet drafted against real evidence

---

## SG-05 — Tool-agnostic foundations

**Goal:** Build governance and context structures that outlive any single AI tool's lifecycle.

**Horizon:** Long-term

**Traces to Strategic Intent:** Protects an ambition ahead of readiness from being locked to whichever vendor is fashionable when the pilot starts.

**Traces to Inhouse Initiative:** Avoid locking to whatever vendor the initiative already picked, unless that choice is itself the target.

**Current State Evidence:** [TBD — link to [Architecture](/AI%20SDLC/02%20Capture/01%20Current%20State/Architecture.md) / [Context Topology](/AI%20SDLC/02%20Capture/01%20Current%20State/Context%20Topology.md) showing how tightly current architecture is already coupled to a specific vendor]

**Evidence (Problem Space):** [TBD — Problem Space domain link]

**Priority:** [TBD]

**Status:** 🔄 Shaped — illustrative placeholder, not yet drafted against real evidence

---

Once this list holds steady, it feeds directly into [Solution Space — Target State](/AI%20SDLC/05%20Solution%20Space/02%20Target%20State.md) and the coverage matrix that [Solution Space — 01 Overview](/AI%20SDLC/05%20Solution%20Space/01%20Overview.md) describes: every row above should be traceable to at least one solution element by the time Pilot is defined.

_Not yet agreed — [[CLIENT_NAME]]'s confirmed Solution Goals are recorded here once Problem Space evidence holds steady. Add a numbered entry per goal as it's drafted; once a goal's status changes, update both the Registry row and its own section in the same edit — they should never disagree._

---

## Changelog

_Every change to this page traces to the Strategic Intent it grounds and the Problem(s) it's evidenced against — a goal shaped or confirmed without both links isn't ready for this table._

| Date   | Change                                                                 | Evidence                                                                                                                                  |
| ------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [DATE] | [WHAT CHANGED — e.g. "SG-01 shaped" / "SG-03 confirmed" / "SG-04 cut"] | [Strategic Intent](./02%20Strategic%20Intent.md) · [Problems — e.g. P-01](/AI%20SDLC/03%20Problem%20Space/02%20Diagnose/02%20Problems.md) |
