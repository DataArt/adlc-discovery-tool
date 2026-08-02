---
name: bootstrap-client
description: Instantiate this starter kit for a new client engagement (/bootstrap-client). Two independently re-runnable phases — mechanical (collects CLIENT_NAME, ORG_PREFIX, GitHub org/repo/IDs, Giscus config; applies via the deterministic scripts/bootstrap/bootstrap-client.mts) and narrative (optional — asks one engagement-story question, then derives and write-confirms the personalized "story" section on each of the Connect Framework/Workshops/Problem Space/Solution Space index pages from it). Detects what's already done on each run, so a first pass can skip narrative and a later pass can skip straight to it.
---

The developer wants to bootstrap this starter kit for a new client. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

This is a one-time setup flow with two phases: **Q&A** (this skill — judgment, wording, and external-setup steps live here) and **deterministic apply** (a script — zero free-text generation, same input always produces the same output). See `STARTER-KIT-PLAN.md`'s Personalization Inventory for the full rationale behind every value collected below.

Each phase is independently re-runnable — Step 0 detects what's already done so a second run doesn't repeat work or re-ask questions that already have answers.

---

## Step 0 — Detect current state

Before asking anything, check what this instance already has.

**Mechanical phase:**

```bash
grep -rl "\[\[CLIENT_NAME\]\]" --include="*.md" --include="*.ts" --include="*.vue" --include="*.json" . 2>/dev/null | grep -v "scripts/bootstrap/\|\.claude/skills/bootstrap-client/"
```

- Non-empty → mechanical phase not (fully) done. Continue to Step 1 as normal.
- Empty → `[[CLIENT_NAME]]` is fully resolved already. Say: "This instance already looks bootstrapped — no `[[CLIENT_NAME]]` tokens remain. Skip the mechanical setup and jump straight to the narrative sections?" **Stop and wait.** If confirmed, skip to Step 8. If the developer wants to re-run the mechanical phase anyway (e.g. to correct a value), continue to Step 1.

**Narrative phase** — for each page below, grep for its anchor text. Anchor still present means that page's section is still a placeholder; anchor absent means it was already filled in a prior run.

| Page                                      | Anchor text (present = not yet filled)                               |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `docs/AI SDLC/Connect Framework/index.md` | `[Why a structured problem→solution framework matters for`           |
| `docs/AI SDLC/Workshops/index.md`         | `[Known constraints that will shape how discovery actually runs for` |
| `docs/AI SDLC/Problem Space/index.md`     | `[What pain points`                                                  |
| `docs/AI SDLC/Solution Space/index.md`    | `[Early signal on where the solution might land`                     |

Build the list of still-unfilled pages — this is what Step 8 asks about, not necessarily all four. Report the split up front, e.g.: "Narrative sections: Connect Framework and Workshops are already filled in; Problem Space and Solution Space are still placeholders."

- All four already filled → tell the developer and skip straight to Step 10. If the mechanical phase was also skipped, there's nothing left to bootstrap — say so and stop; don't proceed to Step 10's commit prompt with nothing to report.
- Some filled, some not → proceed through Steps 1–7 or straight to Step 8 (per the mechanical check above), but Step 8 only asks about the unfilled subset.
- None filled → proceed normally, all four in scope for Step 8.

---

## Step 1 — Client name

Ask:

> "What's the client's name? This replaces `[[CLIENT_NAME]]` everywhere across the docs (~80 occurrences)."

**Stop and wait.**

---

## Step 2 — Org prefix

Derive a suggested `ORG_PREFIX` from the client name: lowercase, alphanumeric + hyphens only, ≤20 characters. Keep it short — it feeds every AWS resource name, IAM role name, and SSM path (`{org}-{env}-{workload}-{location}-{type}-{index}`), and those have their own length ceilings.

> "Suggested org prefix: `{slug}` — used in every AWS resource name, IAM role, and SSM path. Accept, or give me a different one?"

**Stop and wait.** Validate whatever the developer confirms against `^[a-z0-9]([a-z0-9-]{0,18}[a-z0-9])?$`. If it doesn't match, explain why and ask again — don't silently coerce it.

---

## Step 3 — GitHub org/repo

Ask:

> "Which GitHub org and repo will this instance live in? (e.g. `AcmeCorp/adlc-discovery-acme`)"

**Stop and wait.**

If the repo already exists, fetch the numeric IDs the OIDC trust policy needs — deterministic, don't ask the developer to hunt these down by hand:

```bash
gh api repos/{org}/{repo} --jq '{repoId: .id, orgId: .owner.id}'
```

If the repo doesn't exist yet, this is a guarded, external side effect — present it as an instruction, never run `gh repo create` yourself:

> "Create the repo first: `gh repo create {org}/{repo} --private` (or via github.com), then tell me when it's done and I'll fetch the IDs."

**Stop and wait** until both numeric IDs are confirmed.

---

## Step 4 — Giscus (comments widget)

Explain the manual prerequisites — external side effects, presented as instructions, never run automatically:

> "Before I can wire up comments:
>
> 1. Enable **Discussions** on `{org}/{repo}` (repo Settings → General → Features)
> 2. Install the [giscus GitHub App](https://github.com/apps/giscus), scoped to `{org}/{repo}`
> 3. Create a Discussions category for comments — Announcements format, so only maintainers/giscus start new top-level discussions (reuse the name "ADLC Comments", or pick your own)
>
> Tell me once all three are done — or say skip if you want to wire up comments later."

**Stop and wait.**

If confirmed, fetch both IDs via the authenticated GraphQL API. The repo is private, so giscus.app's own unauthenticated config tool can't see it — that's expected, not a misconfiguration:

```bash
gh api graphql -f query='
  query {
    repository(owner: "{org}", name: "{repo}") {
      id
      discussionCategories(first: 10) {
        nodes { id name }
      }
    }
  }
'
```

`repository.id` → `GISCUS_REPO_ID`. Match the category name from Step 4 above against `discussionCategories.nodes` → that node's `id` is `GISCUS_CATEGORY_ID`.

If the developer chose to skip, leave both values empty — the script handles missing Giscus values gracefully (comments stay unwired until run again later).

---

## Step 5 — Confirm before writing anything

Show the full resolved set for explicit sign-off — nothing touches disk before this:

> "Here's everything I'll apply:
>
> | Value                            |                          |
> | -------------------------------- | ------------------------ |
> | `CLIENT_NAME`                    | `{value}`                |
> | `ORG_PREFIX`                     | `{value}`                |
> | `GITHUB_ORG` / `GITHUB_ORG_ID`   | `{value}` / `{value}`    |
> | `GITHUB_REPO` / `GITHUB_REPO_ID` | `{value}` / `{value}`    |
> | `GISCUS_REPO_ID`                 | `{value or "— skipped"}` |
> | `GISCUS_CATEGORY_ID`             | `{value or "— skipped"}` |
>
> Confirm to proceed?"

**Stop and wait for explicit confirmation.**

---

## Step 6 — Dry run, then apply

Run the deterministic script in `--dry-run` mode first:

```bash
yarn bootstrap:client --client-name "{value}" --org-prefix {value} \
  --github-org {value} --github-org-id {value} \
  --github-repo {value} --github-repo-id {value} \
  [--giscus-repo-id {value}] [--giscus-category-id {value}] \
  --dry-run
```

Show the developer the output as-is (file/replacement counts — don't re-derive or summarize it yourself). Ask:

> "This will change `{N}` files (`{M}` replacements) plus the 3 `project.json` files, and scaffold `.env.dev` files where they don't already exist. Apply for real?"

**Stop and wait.** If confirmed, re-run the exact same command with `--dry-run` removed.

If the script errors (invalid input, missing required value), relay its error message directly — do not paraphrase or guess at a fix. Return to whichever step collects that value.

---

## Step 7 — Report (mechanical phase)

Summarize what changed, from the script's own final output. Then remind the developer:

- Fill in `AWS_REGION`, `LOCATION_SHORT`, `ENVIRONMENT` in the newly-scaffolded `.env.dev` files — these are deployment-environment values, not client-identity, so this skill doesn't collect them
- AWS account setup, `cdk bootstrap`, and the first `cdk deploy` are a separate step — point to the deployment runbook once it exists (Iteration 6 in `STARTER-KIT-PLAN.md`)

Do not suggest a commit yet — the narrative phase below still has to run or be explicitly skipped first, so the developer commits once with everything, not twice.

---

## Step 8 — Personalized narrative sections (optional, judgment-heavy)

Four pages each carry a placeholder "story" section — client-specific narrative, not identity tokens — added by design so a fresh clone shows the intended shape even before bootstrap:

| Page                                      | Section                                      | Hedge required?                                                  |
| ----------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| `docs/AI SDLC/Connect Framework/index.md` | Why This Matters for `{CLIENT_NAME}`         | No                                                               |
| `docs/AI SDLC/Workshops/index.md`         | Finding `{CLIENT_NAME}`'s Improvement Points | No                                                               |
| `docs/AI SDLC/Problem Space/index.md`     | Entering Hypothesis                          | **Yes** — this is pre-workshop anecdote, not a validated finding |
| `docs/AI SDLC/Solution Space/index.md`    | Early Direction                              | **Yes** — same reason                                            |

Only ask about the subset Step 0 flagged as still-unfilled — if Step 0 found some pages already done, don't re-ask about those; note them as already complete instead. This step is entirely optional beyond that — the developer may not have had any client conversations yet. Ask, scoped to the unfilled subset:

> "{N} docs page(s) still have placeholder 'story' sections — {list of unfilled page names}. Want to fill these in now, or skip and leave them as placeholders for later?"

**Stop and wait.** If skipped, go straight to Step 10 — leave the bracketed placeholder text and the `[!WARNING]`/`[!IMPORTANT]` callouts exactly as they are on the still-unfilled pages. Do not fabricate an answer to fill the gap.

If proceeding, ask **one** open-ended question — not four separate ones. The four pages are different facets of a single engagement story, and asking them separately forces the developer to artificially chop up one narrative into four answers instead of just telling it once:

> "Tell me the engagement story — why are we here? What's driving this for `{CLIENT_NAME}`: how it came about, what they're hoping to get out of it, and anything they've already told you about where it hurts or where they'd like to end up."

**Stop and wait.** This single answer is the raw material for every in-scope page in Step 9 — do not ask the four page-specific questions from earlier drafts of this skill.

---

## Step 9 — Derive and confirm each section

Take the one story answer from Step 8 and derive each in-scope page's section from it — each page pulls a different facet out of the same story, it isn't a fresh question:

| Page              | Facet to extract                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Connect Framework | Why a structured problem→solution framework matters here specifically — what they're trying to achieve, why not jump straight to a fix     |
| Workshops         | Constraints that'll shape how discovery actually runs — industry specifics, team structure, prior AI initiatives, stakeholder availability |
| Problem Space     | Pain points already mentioned — sales conversations, an RFP, public information                                                            |
| Solution Space    | Early signal on where the solution might land — likely pilot domain, known constraints, stated aspirations                                 |

If the story doesn't contain material for one of the in-scope pages (e.g. no pilot-domain signal was mentioned at all), don't invent one — leave that page's placeholder as-is and note it as unanswered in Step 10. Don't force a facet out of material that isn't there.

Apply the write-confirm pattern individually per page — one at a time, not all four before any confirmation:

1. Draft 2–4 sentences pulling that page's facet from the story, replacing the bracketed placeholder text. Match this repo's existing tone throughout `docs/AI SDLC/` — short sentences, no marketing language, no unearned certainty. For Problem Space and Solution Space, the drafted prose itself should also read as tentative ("early signal suggests…", "mentioned that…") — the `[!IMPORTANT]` callout above it is not enough on its own if the prose reads as settled fact.
2. Write the file.
3. Say: "Updated `{page}`'s `{section}` section. Review — any corrections?"
4. **Stop and wait.** Apply corrections and re-save; repeat from step 3 until confirmed.
5. Move to the next in-scope page.

---

## Step 10 — Final report and commit

Summarize what actually ran this session — it may be just one phase, per Step 0's routing:

- Mechanical: either the Step 7 apply summary, or "already bootstrapped, skipped."
- Narrative: which of the four sections were filled this run, which were already done from a prior run, and which are still left as placeholders.

Suggest a commit message reflecting what actually changed — the full one if both phases ran this session, narrower if only one did:

> `chore: bootstrap client — {CLIENT_NAME}`
> `docs: personalize narrative sections — {CLIENT_NAME}` (narrative-only run)

**Stop and wait** for the developer to confirm the commit. This skill never commits or pushes on its own — `git push` is a guarded command.
