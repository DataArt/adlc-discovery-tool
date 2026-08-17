---
skill: writing-docs
output: .claude/skills/writing-docs/SKILL.md
---

## Purpose

Thin rule skill that delegates all principles to the project's two authoritative Engineering Guide articles, then adds the one project-specific rule: keeping the docs site sidebar config in sync whenever a doc file is added, renamed, or removed.

## Substitutions

| Placeholder                  | Source                                                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `{{DOC_STRUCTURE_ARTICLE}}`  | Path to the doc structure article (e.g. `docs/Engineering Guide/10 Doc Structure.md`)                                        |
| `{{DOC_PRINCIPLES_ARTICLE}}` | Path to the documentation principles article (e.g. `docs/Engineering Guide/11 Documentation Principles.md`)                  |
| `{{DOCS_SITE_CONFIG_FILE}}`  | Path to the docs site config that owns the sidebar (e.g. `docs/.vitepress/config.ts` for VitePress, `mkdocs.yml` for MkDocs) |

## Conditionals

None.

## Verify checklist

- [ ] TEMPLATE.md starts with `---` frontmatter containing `name:` (skill name) and `description:` (trigger conditions for this skill)

- [ ] Both article paths resolve to files that exist in the project
- [ ] `{{DOCS_SITE_CONFIG_FILE}}` points to a real file that controls the docs site navigation
- [ ] The sidebar rule mentions both adding AND renaming/removing
- [ ] Skill is short enough to read in under 30 seconds — if it exceeds ~25 lines, content has leaked back in that belongs in the articles
