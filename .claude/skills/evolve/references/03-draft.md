# Draft — internal Triage procedure

Invoked by Triage, not exposed as `/evolve draft`.

Read [the improvement interface](../interfaces/improvement.md) and the scoped
report. Legacy `.claude/skills/drafts/{name}.md` candidates may be imported without
deleting the original; record its source path in `Report.md` and do not activate it
while importing.

Read the affected owner, its callers, the applicable authoring/documentation
guidance (`.claude/skills/harness-bootstrap/patterns/skill-authoring.md`,
`docs/Engineering Guide/07 Documentation Principles.md` for docs work), and the
provider format already used by this project. Prepare the smallest change satisfying
the acceptance criteria inside the candidate's `candidate/` directory. New skills
use `{name}/SKILL.md` with `name` and `description` frontmatter, matching the
structure of existing `.claude/skills/{name}/` directories; new agents follow the
frontmatter/body format of existing `.claude/agents/{name}.md` files. Preserve
companion paths (templates, references, patterns) and load substantial references
progressively. Use scripts for repeatable mechanical work when justified, not for
open-ended judgment.

Record destination paths, before-content hashes (or absence), proposed files and
explicit removals in `Report.md`. Preserve the existing active version until Adopt.
Define representative positive, negative-trigger and regression scenarios using
[the validation interface](../interfaces/validation.md). Show the candidate and its
scope for review. Draft completion requires inspectable content and criteria.
