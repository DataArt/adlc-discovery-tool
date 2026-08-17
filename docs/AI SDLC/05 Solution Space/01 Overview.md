# Overview

> [!NOTE] Static Page
> This page describes the solution's three-phase shape and does not change during the engagement. Each phase page below holds draft ideas — provisional, not commitments — updated as [Problem Space](/AI%20SDLC/03%20Problem%20Space/) findings mature.

This is about the solution itself — what gets built and rolled out for [[CLIENT_NAME]], not the process for reaching it or the engagement's own logistics.

> Think Big, Start Small, Scale Fast.

- **Think Big** — identify long-term, transformative future trends, disruptions, and ambitious visions. Do not restrict the imagination. Made concrete in [Target State](./02%20Target%20State.md) once there's evidence to ground it in — not restricted at the ideas stage.
- **Start Small** — break the massive vision down into bite-sized, low-risk, experimental projects to gather real data and test assumptions. This is [Pilot](./03%20Pilot.md).
- **Scale Fast** — once a small prototype proves its value, aggressively pour resources into it to expand into full-fledged, widespread operations. This is [Scale](./04%20Scale.md).

This engagement pivots the mantra into a closed loop, not a one-shot sequence: Think Big sets the ambition behind the whole solution, Start Small becomes Pilot, Scale Fast becomes Scale — and [Evolve](./05%20Evolve.md) closes the loop, feeding what's learned back into the next Think Big.

```mermaid
flowchart TB
    T["Target State\nWhat does the end state actually look like for [[CLIENT_NAME]]?"]
    F["Pilot\nWhat's the one thing we prove first, and how?"]
    SC["Scale\nHow does the proven pattern extend beyond the pilot?"]
    SU["Evolve\nWhat do we change based on what we've learned?"]

    T -.->|"is the destination checked against"| F
    F --> SC --> SU
    SU -.->|"feed learnings back"| F
    SU -.->|"refines"| T

    classDef target fill:#8B5CF6,stroke:#6D28D9,color:#fff
    classDef foundation fill:#F59E0B,stroke:#B45309,color:#000
    classDef scale fill:#3B82F6,stroke:#1D4ED8,color:#fff
    classDef sustain fill:#10B981,stroke:#047857,color:#fff

    class T target
    class F foundation
    class SC scale
    class SU sustain
```

| Phase        | Purpose                                                                                                                                                                                                    | Deliverables                                                                                        | Page                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Target State | Ground the "Think Big" ambition in [[CLIENT_NAME]]'s actual Current State, Problems, and [Solution Goals](/AI%20SDLC/04%20Goals/03%20Solution%20Goals.md) — what full adoption looks like here, concretely | Target Phase × Context Matrix for [[CLIENT_NAME]]; gap to Current State stated                      | [Target State](./02%20Target%20State.md) |
| Pilot        | Define the pilot workload, stand up an AI-assisted process and toolset, scope a knowledge base to it (phased), and educate the team on how to work with it                                                 | Workload defined; AI-assisted process & toolset live; scoped knowledge base; team educated          | [Pilot](./03%20Pilot.md)                 |
| Scale        | Extend the workload to the wider product context, wire governance control from product down to project, widen the knowledge base, and educate and control access as the group grows                        | Workload at product scope; governance wired; wider knowledge base; team educated; access controlled | [Scale](./04%20Scale.md)                 |
| Evolve       | Gather metrics, analyse them, build dashboards and reporting, identify problems, and reiterate the solution                                                                                                | Metrics gathered; dashboards & reporting live; problems identified; solution reiterated             | [Evolve](./05%20Evolve.md)               |

Each phase page is grounded in current [Problem Space](/AI%20SDLC/03%20Problem%20Space/) findings and linked back to the specific evidence behind each idea. Pilot, Scale, and Evolve should each be checkable against [Target State](./02%20Target%20State.md) — does this move [[CLIENT_NAME]] toward that picture, not just away from Current State without a clear destination.

Once a phase's scope and timing are agreed, they feed the [Roadmap](/AI%20SDLC/06%20Roadmap/) — the settled shape this solution converges on.
