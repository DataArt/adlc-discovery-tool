# Target State

> [!WARNING] Populated During Engagement
> Ideas below are provisional — grounded in [Problem Space](/AI%20SDLC/03%20Problem%20Space/) and [Solution Goals](/AI%20SDLC/04%20Goals/03%20Solution%20Goals.md) findings as they mature, not commitments. This page is the "Think Big" ambition made concrete for [[CLIENT_NAME]] specifically — the ["Target Agentic SDLC Setup"](/The%20Story/05%20Target%20Agentic%20SDLC%20Setup.md) instantiated for this estate, not the generic version.

> What does the end state actually look like for [[CLIENT_NAME]] — before deciding how to get there in phases?

---

## Why This Page Exists

[Target Agentic SDLC Setup](/The%20Story/05%20Target%20Agentic%20SDLC%20Setup.md) describes the target configuration in the abstract — which context layer feeds which phase, tool-agnostic, true for any organisation. This page is the same picture, grounded in [[CLIENT_NAME]]'s actual Current State ([Process](/AI%20SDLC/02%20Capture/01%20Current%20State/Process.md), [Architecture](/AI%20SDLC/02%20Capture/01%20Current%20State/Architecture.md), [Context Topology](/AI%20SDLC/02%20Capture/01%20Current%20State/Context%20Topology.md), [AI Adoption](/AI%20SDLC/02%20Capture/01%20Current%20State/AI%20Adoption.md), [Metrics](/AI%20SDLC/02%20Capture/01%20Current%20State/Metrics.md), [Tool Inventory](/AI%20SDLC/02%20Capture/01%20Current%20State/Tool%20Inventory.md), [Inhouse Initiatives](/AI%20SDLC/02%20Capture/02%20Inhouse%20Initiatives/Overview.md)), diagnosed [Problems](/AI%20SDLC/03%20Problem%20Space/), and confirmed [Solution Goals](/AI%20SDLC/04%20Goals/03%20Solution%20Goals.md) — what full adoption specifically looks like here, at project, product, and organisation scale. Where an [existing internal initiative](/AI%20SDLC/02%20Capture/02%20Inhouse%20Initiatives/Overview.md) already covers part of this picture, the target respects and builds on it rather than proposing a competing version.

[Pilot](./03%20Pilot.md), [Scale](./04%20Scale.md), and [Evolve](./05%20Evolve.md) are the phased path to this picture — not three independent ideas. Each phase should be checkable against this page: does it move [[CLIENT_NAME]] closer to this target, or just further from Current State without a clear destination?

---

## The Target Picture for [[CLIENT_NAME]]

_TBD — once Current State, Problems, and Solution Goals hold steady, draft the client-specific version of the [Phase × Context Matrix](/The%20Story/05%20Target%20Agentic%20SDLC%20Setup.md#phase-%C3%97-context-matrix): which of [[CLIENT_NAME]]'s actual tools and systems sit at each context layer, and what wiring is currently missing._

| Context Layer       | [[CLIENT_NAME]]'s Current Owner/Tool | Target State |
| ------------------- | ------------------------------------ | ------------ |
| Business Context    | _TBD_                                | _TBD_        |
| Operational Context | _TBD_                                | _TBD_        |
| Technical Context   | _TBD_                                | _TBD_        |
| Integration Context | _TBD_                                | _TBD_        |
| Project Context     | _TBD_                                | _TBD_        |

---

## Gap to Current State

_TBD — the delta between Current State ([Process](/AI%20SDLC/02%20Capture/01%20Current%20State/Process.md), [Architecture](/AI%20SDLC/02%20Capture/01%20Current%20State/Architecture.md), [Context Topology](/AI%20SDLC/02%20Capture/01%20Current%20State/Context%20Topology.md), [AI Adoption](/AI%20SDLC/02%20Capture/01%20Current%20State/AI%20Adoption.md), [Metrics](/AI%20SDLC/02%20Capture/01%20Current%20State/Metrics.md), [Tool Inventory](/AI%20SDLC/02%20Capture/01%20Current%20State/Tool%20Inventory.md), [Inhouse Initiatives](/AI%20SDLC/02%20Capture/02%20Inhouse%20Initiatives/Overview.md)) and the picture above, stated plainly enough that Pilot/Scale/Evolve can be sized against it. Any layer already covered by an existing internal initiative narrows the gap here — state what it already covers, don't re-gap it._

> [!IMPORTANT] This page states the gap — it doesn't close it
> Metrics/observability/KPIs, tooling choices, wiring, repo composition, and context topology are architecture decisions, not something drafted directly on this page. Once a gap row above is confirmed, it becomes a `/design` ticket — Frame → Research → Elaborate → Solution → Publish — that produces the actual spec and lands it in [Target Architecture (HLD)](/Target%20Architecture%20%28HLD%29/). See [Process → Overview, Solution phase](/AI%20SDLC/01%20Engagement/03%20Process/01%20Overview.md#-solution).

## Open Questions

- Which context layer has the widest gap between Current State and Target State — and is that the right place to start Pilot?
- Does [[CLIENT_NAME]]'s existing tooling support this target directly, or does part of the gap require a tooling change, not just a process/context change?
- Is there a layer where [[CLIENT_NAME]] is already close to target — and Pilot should protect that, not disrupt it?
- Does any [existing internal initiative](/AI%20SDLC/02%20Capture/02%20Inhouse%20Initiatives/Overview.md) already own part of this picture — and if so, does the target respect that ownership boundary?
