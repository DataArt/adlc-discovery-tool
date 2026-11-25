# Requirements analysis

Help stakeholders decide what is in scope by tracing each requirement to its source, surfacing contradictions, and identifying questions that need a decision. The weekly review applies this analysis to a defined reporting window.

## Connectors and integrations

| Path                                      | What it uses                                                                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supplied brief and stakeholder objectives | No connector is needed. For linked inputs, read only the selected requirements sources.                                                                       |
| Weekly requirements review                | A host scheduler and Atlassian read access to both the selected Jira project and Confluence space. The report goes to the configured result destination.      |
| Optional specialist review                | The business analyst and requirements reviewer roles. Delegation needs a supported host and authorization. Their instructions also support sequential review. |

## Sequence diagram

```mermaid
sequenceDiagram
    actor U as Stakeholder
    participant A as Requirements analysis
    participant J as Jira and Confluence
    participant D as Scheduler result
    alt Interactive analysis
        U->>A: Supply requirements, objectives and source references
    else Weekly review
        A->>J: Read scoped evidence for the reporting window
        J-->>A: Return issues, pages and available context
    end
    A->>A: Trace requirements and identify conflicts and gaps
    opt Specialist review selected
        A->>A: Reconcile analyst and reviewer findings
    end
    alt Interactive analysis
        A-->>U: Return draft matrix and clarification questions
    else Weekly review
        A-->>D: Report sourced findings and coverage gaps
    end
```
