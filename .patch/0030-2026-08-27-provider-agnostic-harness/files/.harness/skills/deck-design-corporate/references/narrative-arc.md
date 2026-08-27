# Narrative arc — AIMS-output → deck-slot mapping

> **Migration mode does NOT use this arc.** When re-skinning an existing
> presentation (`references/deck-migration.md`), the SOURCE deck's slide order
> and count are authoritative — you preserve them and adapt the design. The
> AIMS arc + corporate skeleton below apply only to **fresh builds** (standalone
> brief / handoff).

**Read this at Workflow Step 4** (Build the narrative arc & slide list).
Owns the canonical mapping between **AIMS pass outputs** (`agent/references/aims-judgement.md`)
and **deck slot positions**. Slide order is not improvised — it is
**derived from which AIMS outputs the brief carries**.

The deck arc is not a fixed template-per-deck-type recipe («pitch = 8
slides in this order»). It is a **sequence of slots**, each backed by
a specific AIMS output. Optional slots are skipped when their AIMS
source is empty. Slot order is fixed (so the audience reads the same
narrative shape across all DataArt decks); slot density varies
(1 slide for «commercial model» on a small deck, 2-3 on a large one).

> **The arc fills the middle of a FIXED corporate skeleton.** The AIMS
> slots below are the _content_ of the deck, but they are always wrapped
> by mandatory corporate frame slides defined in `kit-map.md § 6`:
> `cover → asis-fastfacts → asis-capabilities → …AIMS arc… →
[partnerships?] → [microsoft?] → [team? ask-first] → content-nextsteps →
asis-contacts → final`. Fast-facts, capabilities, next-steps, and
> contacts are **not AIMS-gated** — they ship in every deck. Slot 11
> (Follow-up / next steps) below IS the `content-nextsteps` slide; it is
> **required, never optional**. The team slide is ask-first (SKILL.md
> Step 5b). Read § 6 alongside this file at Step 4.

---

## The canonical slot order

| #   | Slot                              | AIMS source                                            | Required?                                           |
| --- | --------------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| 1   | **Cover open**                    | — (always present)                                     | required                                            |
| 2   | **Audience reality**              | AIMS-A § audience_reality + market_context             | optional¹                                           |
| 3   | **Opportunity / problem**         | AIMS-A § hypothesis (failure mode without action)      | required                                            |
| 4   | **Why us / proposition**          | AIMS-A direction + reusable_candidates                 | **required for client-facing — always slot 3 or 4** |
| 5   | **Solution / what we build**      | AIMS-A direction (continued, with detail)              | required                                            |
| 6   | **Interaction / how it works**    | AIMS-I § interaction_model + control_moments           | optional                                            |
| 7   | **Process / engagement model**    | AIMS-M selected_design_systems + quality_bar           | optional                                            |
| 8   | **Proof / case studies**          | section-divider + `content-placeholder` (human-filled) | optional²                                           |
| 9   | **Commercial model**              | AIMS-M (commercial-model output, when present)         | optional                                            |
| 10  | **Trust risks / what could fail** | AIMS-S § trust_risks                                   | optional                                            |
| 11  | **Follow-up / next steps**        | AIMS-S § follow_up_path                                | required                                            |
| 12  | **Cover close**                   | — (always present)                                     | required                                            |

¹ _Audience reality_ is implicit in the cover or opportunity slide
when the brief audience is universally understood; emit a separate
slide only when audience framing is non-obvious.

² _Proof / case studies_ is a SECTION the human fills, not generated
content. When included, scaffold it as a **section divider titled
"Case Studies" (next chapter number) + one `content-placeholder.html`**
slide ("Add your case studies here"). NEVER fabricate case-study cards or
"to be completed" placeholders — DataArt's real, approved case studies
live in the Slides Library and the person drops them in. See
`kit-map.md § 7 → "Case studies = a section the human fills"`. Skip the
section only when the brief explicitly says «no case studies».

---

## Position rules (hard, enforced)

1. **«Why us» always sits at slot 3 or 4 — never deep.** Trust precedes
   proof. If audience needs to see «can these people deliver?» before
   they care about solution details, the proposition has to land
   early. Don't bury Why-us at slot 9 (real-deck failure that prompted
   this rule).
2. **«Follow-up / next steps» (= `content-nextsteps`) always sits at the
   end of the AIMS arc**, just before the corporate close frame
   (`asis-contacts` → `final`). It is **required in every deck** — every
   deck ends with a concrete action the audience can take. (`asis-contacts`
   is the literal second-to-last slide; next-steps comes immediately
   before it — see kit-map § 6.)
3. **«Cover close» always last.** No content slide after the closing
   cover.
4. **«Trust risks» before «Follow-up», not after.** Risks open the
   door for the audience's objections; follow-up answers «what do we
   do next given those risks». Inverting the order makes the close
   feel hollow.
5. **«Proof / case studies» before «Trust risks».** Show what you've
   done before discussing what could go wrong.

---

## Selecting the slot set for a given deck

Step-by-step:

1. **Run the AIMS pass** (Step 2 of `agent/orchestrator.md`). It
   produces outputs for A / I / M / S blocks.
2. **For each slot in § The canonical slot order**, check whether its
   AIMS source is non-empty:
   - Required slots are always included.
   - Optional slots are included **only when their AIMS source is
     non-empty**.
3. **Allocate density per slot.** A focused 5-slide deck might collapse
   slots 4-5 into one «solution» slide; a 15-slide deck might expand
   slot 8 into «3 patterns of case studies + 3 dedicated case-study
   slides».
4. **Lock the order.** Once slots are selected and allocated, slide
   order is determined — no reshuffling later. (Slide-09 ≠ «Why
   DataArt»; Why-DataArt is at slot 4, regardless of total deck
   length.)

---

## Slot → template + background hints

The corporate kit picks **backgrounds by slide type** (title pool vs
content pool, see `composition-rules.md § 0.12`) and **templates by
content shape**. Below: for each slot, the templates that fit and the
background pool. **Content backgrounds are picked one per section** and
reused across that section's slides — they are NOT varied per slide.

| Slot                           | Template options (preferred → alternates)                                                                                                                                                        | Background                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Cover open                     | `cover.html` → `cover-2logo.html` (partnership)                                                                                                                                                  | `bg-title-03/04/05` (vivid) for `cover`; `bg-cover-light` for `cover-2logo`.                          |
| Section start (divider)        | `section-divider.html` → `statement.html` (big claim)                                                                                                                                            | `bg-title-01/02/06` (muted), one per section; `statement` keeps `bg-title-06`.                        |
| Audience reality / opportunity | `content-stacked-list.html` → `content-split.html`                                                                                                                                               | Section's `bg-content-0N`.                                                                            |
| Why us / proposition           | `content-cards.html` → `content-icon-cards.html` → `content-split.html`                                                                                                                          | Section's `bg-content-0N`.                                                                            |
| Solution / what we build       | `content-cards.html` → `content-stacked-list.html` → `content-icon-cards.html`                                                                                                                   | Section's `bg-content-0N`.                                                                            |
| Interaction / mechanics        | `content-process.html` → `content-pipeline.html` → `content-split.html`                                                                                                                          | Section's `bg-content-0N`.                                                                            |
| Process / engagement model     | `content-numbered-icon-cards.html` (steps) → `content-process.html` (Fix→Grow→Transform) → `content-timeline.html` / `content-plan-table.html` (dated plan) → `content-nextsteps.html` (roadmap) | Section's `bg-content-0N`. Pick by shape: numbered steps / arrow flow / dated plan / forward roadmap. |
| Proof / case studies           | `content-table.html` → `quote.html` → `content-stats-map.html` → `content-logo-grid.html`                                                                                                        | Section's `bg-content-0N`.                                                                            |
| Commercial model               | `content-table.html` → `content-numbered-boxes.html` (line items)                                                                                                                                | Section's `bg-content-0N`.                                                                            |
| Trust risks / what could fail  | `content-comparison.html` → `content-stacked-list.html`                                                                                                                                          | Section's `bg-content-0N`.                                                                            |
| Follow-up / next steps         | `content-nextsteps.html` → `content-numbered-icon-cards.html`                                                                                                                                    | Section's `bg-content-0N`.                                                                            |
| Cover close                    | `final.html`                                                                                                                                                                                     | `bg-title-04` (vivid).                                                                                |
| Team / who delivers            | `content-team.html` (square photos) → `content-team-roles.html` (org-chart)                                                                                                                      | Section's `bg-content-0N`.                                                                            |
| 2-actor contrast / comparison  | `content-comparison.html` → `content-split.html`                                                                                                                                                 | Section's `bg-content-0N`.                                                                            |

**Section consistency check at Step 5a.** After grouping slides into
sections, confirm each section uses **one** `bg-content-0N` across all
its content slides (so the section reads as a unit) and that section
boundaries are marked by a `section-divider` on a muted title
background. Cover + final use the vivid title pool; everything in
between alternates content backgrounds **by section, not by slide**.

---

## Examples

### Small pitch deck (5 slides)

| Slide | Slot                                  | Notes                                 |
| ----- | ------------------------------------- | ------------------------------------- |
| 1     | Cover open                            | —                                     |
| 2     | Opportunity + Audience reality merged | one slide framing the problem         |
| 3     | Why us                                | early proposition                     |
| 4     | Solution + Process merged             | one slide showing what we build + how |
| 5     | Cover close + Follow-up merged        | CTA on the close slide                |

### Standard pitch deck (8-10 slides)

| Slide | Slot                       |
| ----- | -------------------------- |
| 1     | Cover open                 |
| 2     | Opportunity / problem      |
| 3     | Why us / proposition       |
| 4     | Solution / what we build   |
| 5     | Interaction / how it works |
| 6     | Proof / case studies       |
| 7     | Trust risks                |
| 8     | Follow-up / next steps     |
| 9     | Cover close                |

### Deep capability deck (15+ slides)

Slots expand: «Solution» becomes 2-3 slides covering different
dimensions; «Process» gets its own dedicated 2-slide breakdown;
«Proof» becomes 3-4 slides (one overview pattern slide + per-case
detail slides); «Commercial model» gets its own slide. «Why us» still
at slot 3-4 — early density doesn't move.

---

## Coverage — every template mapped to a slot

This is the authoritative «which slot does this exemplify» index.
The corporate kit has **no reference-slides**; its `kit-corporate/templates/`
ARE the canonical examples. Every template file appears here. No orphans.
Slot vocabulary: **open** (cover) · **section-start** (divider) ·
**body** · **proof** · **process** · **team** · **close** (final).

### Cover / title templates (4)

| Template file          | Primary slot  | Purpose (showcase §8)                                                                                             |
| ---------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `cover.html`           | open / close  | Standard cover: dark bg (03), white large logo, H0 74 title, dataart.com. Use when there's no client logo.        |
| `cover-2logo.html`     | open          | Partnership cover: light bg, colored DataArt logo + client-logo slot. Use whenever the deck must show both logos. |
| `section-divider.html` | section-start | Each chapter start: muted bg (01/02/06), big auto-increment chapter number + section title. One per section.      |
| `final.html`           | close         | Closing slide: vivid bg (04), "Thank you" + 4 contact lines. Last slide.                                          |

### Content templates (21)

Recipe annotations on each template (see `canvas-zones.md § 4`) declare
`narrative_role` and `content_pattern`. The table below cross-indexes
them by narrative slot. All are count-flexed (`.cols-N` / R×C /
constructor) unless noted.

| Template file                      | Primary slot         | Purpose (showcase §9)                                                           |
| ---------------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| `content-cards.html`               | body                 | 2–4 ordered points with a short explainer + summary line (.cols-N).             |
| `content-numbered-boxes.html`      | body                 | List of short labelled items (infra/scope/cost) + caption lines (2–6 boxes).    |
| `content-numbered-icon-cards.html` | process              | Step-by-step journey: number + icon + short text per step (.cols-N, 2–6).       |
| `content-icon-cards.html`          | body                 | A few highlights with a longer paragraph each, under a sub-heading (2–4 cards). |
| `statement.html`                   | section-start / body | One big claim on a dark slide between sections. Fixed format (bg-title-06).     |
| `content-logo-grid.html`           | proof                | Client / partner / integration logos + caption (R×C of 279×160 boxes).          |
| `content-table.html`               | body / proof         | Structured data — phases, pricing, comparison matrices (R×C; --alt rows).       |
| `content-timeline.html`            | process              | Project plan / roadmap (Gantt constructor: --tl-cols / --tl-rows + task pills). |
| `content-plan-table.html`          | process              | Project plan when each task needs explanation columns (.sheet--plan).           |
| `content-pipeline.html`            | process              | Process/pipeline chain with extra labels; stack chains to compare scenarios.    |
| `content-nextsteps.html`           | close                | "What happens next" roadmap: colour-ramp step panels + captions (.steps-col).   |
| `content-stacked-list.html`        | body                 | A few full-width points, each title + sentence (icon-block rows, N rows).       |
| `content-list-tagged.html`         | body                 | Dense single-line bullet list under a tag + page-heading (scope/enhancements).  |
| `content-process.html`             | process              | Left→right process with arrows (Fix→Grow→Transform), N steps + connector.       |
| `content-comparison.html`          | body                 | "What changes vs what stays" — 2 cols of bold-sub + paragraph + framed summary. |
| `content-split.html`               | body                 | Concept on the left + numbered step list on the right (N list items).           |
| `content-team.html`                | team                 | People with photo + name + LinkedIn (square photos, 3–10 people).               |
| `content-team-roles.html`          | team                 | Delivery team grouped by role/category (round avatars, category per row).       |
| `quote.html`                       | proof                | Single customer testimonial / pull-quote (large quote centred + attribution).   |
| `content-stats-map.html`           | proof / body         | Stats + visual: grid of Fast Facts beside a free map/chart/illustration slot.   |

### Use-as-is slides (5 — fixed, rule-inserted)

Inserted **as-is** (NOT count-flexed). Each carries a fixed insertion
rule — the skill drops it into the deck at the spot the rule names.

| Template file            | Insertion rule                                                                            | Purpose (showcase §10)                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `asis-fastfacts.html`    | **Insert right AFTER the cover.**                                                         | 8 DataArt corporate stats + global-presence map (numbers as-is).                                            |
| `asis-capabilities.html` | **Insert AFTER the Fast Facts slide.**                                                    | 4 capability columns (Innovate / Build / Modernize / Operate).                                              |
| `asis-partnerships.html` | **Insert ONLY if the project involves partnerships & integrations.**                      | 9 partner logos (AWS, Microsoft, GCP, Databricks, Snowflake, Salesforce, HubSpot, Stripe, Adobe) + caption. |
| `asis-microsoft.html`    | **Insert ONLY if the project involves Microsoft technologies / a Microsoft partnership.** | Statement + 6 industry icons.                                                                               |
| `asis-contacts.html`     | **Insert ALWAYS, right BEFORE the last (final) slide.**                                   | 4 office contact cards (photos are placeholders).                                                           |

**Use-as-is insertion order (when all apply):** cover →
`asis-fastfacts` → `asis-capabilities` → … deck body … →
`asis-partnerships` (if integrations) → `asis-microsoft` (if MS) →
`asis-contacts` (always, immediately before) → `final`.

**Audit goal:** every cover/title template (4 / 4), every content
template (21 / 21), and every use-as-is slide (5 / 5) appears in the
tables above. No file is «not covered».

---

## What this file does **not** own

- AIMS pass methodology (probes, depth dial, decision-provenance) —
  owned by `agent/references/aims-judgement.md`.
- Content pattern → template + L2 + L3 mapping — owned by
  `kit-map.md § 5b`.
- Canvas zones and spatial composition — owned by `canvas-zones.md`.
- Visual discipline rules (no nowrap, no off-canvas, etc.) — owned by
  `composition-rules.md § 0`.

This file is only the **narrative-slot order** and the **coverage
index** linking every kit artifact to a slot.
