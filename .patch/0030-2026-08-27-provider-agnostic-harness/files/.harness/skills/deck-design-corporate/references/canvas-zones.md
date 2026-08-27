# Canvas zones — spatial composition map

**Read this when** adding a new sub-object (illustration, mockup, chart,
photo, persona group) to a slide, OR when materialising a template
and need to know which regions carry content vs decoration.

Owns the spatial layer of the composition system. The three-layer
framework (`kit-map.md § 5d`) answers «what L1/L2/L3» — this file
answers «where on the 1920×1080 canvas».

---

## 1. The named zones (1920×1080 grid)

The canvas is 1920 × 1080 px (16:9). It is divided into named zones on a
fixed grid: **left/right margins at 153.333 px → a 1613.333 px content column**
(153.333 → 1766.667 right edge, with `1613.333` as the content-column width). Each
zone has fixed coordinates; the model picks a zone by **name** when
placing or evaluating any element. There is **no side-bar** in this kit.

| Zone ID          | (x, y, w, h)                      | Role                                                                                                                                                       |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heading`        | (153.333, 114.667, 1613.333, ~96) | `.zone-heading` / `.slide-heading`. 1-line title (accent rule y210.667) or 2-line (rule y297.333). Above content.                                          |
| `top-right-logo` | (1569.333, 141.333, 197.333, 32)  | **Canonical small DataArt mark** (`.logo`) on content slides. Fixed every slide — never replace.                                                           |
| `content`        | (153.333, 280, 1613.333, 650.667) | Main content zone. Starts at **y280** (1-line heading) or y358.667 (2-line); **always ends by y930.667** — nothing crosses that line.                      |
| `col-left`       | (153.333, 280, 509.333, 650.667)  | Leftmost content column (3-col grid: width 509.333, gap 42.667).                                                                                           |
| `col-mid`        | (705.333, 280, 509.333, 650.667)  | Middle content column (3-col grid).                                                                                                                        |
| `col-right`      | (1257.333, 280, 509.333, 650.667) | Rightmost content column / "the conclusion lives here" zone.                                                                                               |
| `footer`         | (153.333, 985.333, 1613.333, ~32) | Footer row (P7 16 @ y985.333): `.footer-tagline` @153.333 · `.footer-section` @568 · `.page-number` flush-right @153.333. Fixed positions — never replace. |

The grid is **column-count driven** via `.cols-N`: equal-fill columns
(3 → 509.333 px, 4 → 370.667 px, 5 → 289.333 px, 6 → 233.333 px) within the 1613.333 px
content column, gap 42.667. The `col-*` zones above are the 3-column
default; for other N the columns subdivide the same `content` zone.

### 3-column vs 4-column variants

- **3-column layouts** (default) — `col-left` / `col-mid` / `col-right`
  at width 509.333 px each, gap 42.667.
- **4-column layouts** — the `content` zone subdivides into 4 columns of
  370.667 px (gap 42.667) within the same 153.333 → 1766.667 span.
- **5–6 column layouts** — columns of 289.333 / 233.333 px respectively.
- **2-column / split layouts** (`content-split`, `content-comparison`) —
  the `content` zone splits into a wide-pair (e.g. text left + list
  right) within the 1613.333 px column.

All variants live inside the same `content` zone bounds (y280–930.667);
only the column subdivision changes.

---

## 2. L1 → zone occupancy table

For every content background class (`.bg-content-01…08`, defined in
`kit-corporate/shared/layouts.css`), which zones it decorates with
panels / fills. The corporate content backgrounds are mostly flat
light surfaces with at most a corner / edge graphic, so nearly every
zone is free — read row-by-row when evaluating «can I drop a new
sub-object in zone X».

Legend:

- `■` — zone heavily decorated by the background (panel / strong fill). New hero illustration here = clash (composition-rules § 0.8).
- `·` — zone visually free (just base surface or nothing). Safe for sub-objects.
- `partial` — background paints only an edge / corner touching this zone. Sub-object OK if positioned away from the painted edge.

| Content background | heading | col-left | col-mid | col-right | footer |
| ------------------ | ------- | -------- | ------- | --------- | ------ |
| `bg-content-01`    | ·       | ·        | ·       | ·         | ·      |
| `bg-content-02`    | ·       | ·        | ·       | ·         | ·      |
| `bg-content-03`    | ·       | ·        | ·       | ·         | ·      |
| `bg-content-04`    | ·       | ·        | ·       | ·         | ·      |
| `bg-content-05`    | partial | ·        | ·       | partial   | ·      |
| `bg-content-06`    | partial | ·        | ·       | partial   | ·      |
| `bg-content-07`    | ·       | ·        | ·       | partial   | ·      |
| `bg-content-08`    | ·       | ·        | ·       | partial   | ·      |

**Reading rule:** the corporate content backgrounds are flat light
surfaces — they carry brand identity, not panel structure, so a
sub-object almost never clashes with the background itself. The real
constraint is **content occupancy**: a column already filled with a
`numbered-card` / `icon-block` / sheet is `■` by content, not by
background. Place new sub-objects in columns that carry no content,
keeping everything inside the `content` zone (y280–930.667).

When a background row shows `partial` on a zone (a corner / edge
graphic), anchor any added element away from that edge.

---

## 3. Zone-conflict check — the protocol

Before placing **any** new non-text element (illustration, mockup,
chart, photo, persona group, custom badge cluster):

1. **Identify target zone** by computing the element's center point
   (`left + width/2`, `top + height/2`) and matching to the closest
   zone from § 1. A single element should sit inside one zone; if it
   spans more than one, treat the **densest** zone as primary.
2. **Look up background occupancy** in § 2 for the slide's content background.
3. **Apply the rule:**
   - **Zone is `·` (free):** add freely, subject to hero-illustration
     cap (§ 0.2) and decoration cap (§ 0.6).
   - **Zone is `partial`:** add allowed but position the element away
     from the painted edge (e.g. if the background paints a right-edge
     graphic, anchor the element on the left side).
   - **Zone is `■` (decorated by background or already filled by content):** **conflict.** Resolve by:
     (a) **choose a free zone** for the same element,
     (b) **drop the element** (the existing content is carrying the visual
     weight already),
     (c) **re-pick the content background** if the element is structurally
     essential — this escalates because it affects the deck's
     background palette (Step 5a).
   - **Zone is `top-right-logo` or `footer`:** **never replace** —
     these are canonical positions (§1).
4. **Record the decision** in `deck_output.new_objects_introduced[]`
   alongside the existing `composed_from` / `reason_kit_insufficient`
   fields: add `target_zone: <zone-id>` and `zone_occupancy_check:
passed | resolved-via-relocation | resolved-via-drop`.

---

## 4. Template recipe annotations

Every template carries an HTML comment block near the top of
`<body>` (or right after `<head>`) declaring its zone usage. This is
machine-parseable metadata; humans see nothing in the rendered slide.

### Format

```html
<!--
  recipe:
    content_pattern: "<content pattern name from kit-map § 5b>"
    narrative_role: "<cover | section-divider | body | proof | process | team | close>"
    l1_used: "<bg-content-01 | … | bg-content-08 | bg-title-0N>"
    zones_content: [<list of zone IDs that carry replaceable text>]
    zones_decoration: [<list of zone IDs decorated by L1 or illustration>]
    zones_free: [<list of zone IDs with no decoration AND no content — fork-targets for new sub-objects>]
    forkable: <true | false>
-->
```

### Field semantics

- **`content_pattern`** — cites a row in `kit-map.md § 5b`. Same value
  as the bold/italic content-shape phrase in that matrix.
- **`narrative_role`** — typical role this slide plays in a deck arc.
  Drives background pick (§ 5a / § 5d).
- **`l1_used`** — exact background class applied to this template.
- **`zones_content`** — zones whose text the model **must replace** on
  use (otherwise client gets DataArt's real case-study copy).
- **`zones_decoration`** — zones occupied by background panels or by an
  illustration the slide intentionally carries. **Preserve on use**
  unless deliberately swapping the entire composition.
- **`zones_free`** — zones with neither content nor decoration.
  **Opportunity slots** for adding new sub-objects when materialising.
- **`forkable`** — `true` when the template can be copied and re-textualised
  cleanly; `false` when its content is so structurally specific (e.g.
  the use-as-is fast-facts / capabilities slides carry fixed DataArt
  corporate content) that it should be inserted as-is, never re-templated.

### When the model uses this

- **Step 5.alt of Workflow** — when picking which template to
  materialise. The recipe answers «which zones do I edit, which do I
  leave alone, where can I add new objects».
- **Step 7.1 of Workflow** — when adding a sub-object to a forked
  slide. `zones_free` directly tells you where it's safe to drop.

---

## 5. Sub-object placement guidance

Combining § 2 (background occupancy) and § 4 (template recipes) gives a
deterministic recipe for adding a new sub-object:

1. **Identify the kind of sub-object** (illustration, mockup, chart,
   persona group, badge cluster, custom callout).
2. **Identify the slide's content background** (from `Step 5a` deck
   palette or the template's `l1_used`).
3. **List candidate zones** by intersecting:
   - background free zones (column `·` in § 2 table),
   - template's `zones_free`,
   - zones that **make sense semantically** for the object kind
     (e.g. a prototype mockup belongs in a wide column of the `content`
     zone, not in `footer`).
4. **Pick the leftmost-and-topmost free zone** in the candidate list.
   Tied? Prefer the zone closer to the related content text.
5. **Run § 3 zone-conflict check** before finalising.
6. **Record in `deck_output.new_objects_introduced[]`** per § 3.

### Common cases

- **«Add a prototype mockup to a fully-filled 3-column content slide»** —
  all `col-*` zones are `■` by content. Either drop the mockup, or
  collapse to a 2-column split (`content-split`) so one wide zone frees
  up, or move it to a dedicated `content-stats-map` visual slot.
- **«Add a persona pair to a content slide»** — when columns are free,
  the pair anchors at `col-mid` (centered in the `content` zone),
  leaving `col-left` / `col-right` for surrounding text.
- **«Add an illustration where the background paints a right-edge graphic
  (`bg-content-07/08`)»** — `col-right` is `partial`. Place the
  illustration in `col-left` or `col-mid` instead, away from the
  painted edge.

---

## What this file deliberately does **not** own

- L1 / L2 / L3 catalogue and selection rules — owned by
  `kit-map.md § 5d` (three-layer framework).
- Canonical positions for logo / header / footer — owned by
  `kit-map.md § 1` (the «non-negotiable positions» table).
- Visual discipline rules (no nowrap, max 2 decoration layers, etc.) —
  owned by `composition-rules.md § 0`.
- Content-pattern → template mapping — owned by `kit-map.md § 5b`.

This file owns the **spatial layer**: where things go, what's free,
what's painted by L1, how to check before adding.
