---
skill: story-folder-glob
output: .claude/skills/story-folder-glob/SKILL.md
---

## Purpose

Rule skill that enforces the correct glob pattern when searching for story folders. Square brackets in folder names (`[TICKET-123]`) are glob metacharacters and must never be used as literals in patterns — always use `*{TICKET}*` wildcard instead.

## Substitutions

None — this is a universal rule skill with no project-specific placeholders.

## Conditionals

None.

## Verify checklist

- [ ] TEMPLATE.md starts with `---` frontmatter containing `name:` (skill name) and `description:` (trigger conditions for this skill)

- [ ] Rule states the exact pattern to use: `*{TICKET}*` (with asterisks)
- [ ] Rule explicitly states what NOT to use: `[{TICKET}]*` (square bracket form)
- [ ] Explains WHY: square brackets are glob character classes (metacharacters)
- [ ] Provides both correct and wrong examples
