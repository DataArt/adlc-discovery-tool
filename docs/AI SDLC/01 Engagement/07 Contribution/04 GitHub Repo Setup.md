---
aside: false
---

# GitHub Repo Setup

_Getting the repository onto your computer for the first time — no terminal experience required. Linked from step 1 of [Claude Desktop Setup](./02%20Claude%20Desktop%20Setup.md) and [Codex Desktop Setup](./03%20Codex%20Desktop%20Setup.md) if the one-line clone command there doesn't work for you._

## Two ways to do this

| Method                                               | Best for                                       | What you need                        |
| ---------------------------------------------------- | ---------------------------------------------- | ------------------------------------ |
| GitHub Desktop — point and click, no typing commands | You've never used a terminal before            | A GitHub account, GitHub Desktop app |
| Terminal / PowerShell                                | You're comfortable typing a couple of commands | Git installed, a GitHub account      |

If you're not sure which to pick, use GitHub Desktop.

## Option A — GitHub Desktop (no terminal)

1. If you don't have one, create a free GitHub account at https://github.com/signup.
2. Download and install GitHub Desktop from https://desktop.github.com.
3. In your browser, go to the repo — https://github.com/[[GITHUB_ORG]]/[[GITHUB_REPO]] — and sign in if asked.
4. Click the green **Code** button, then **Open with GitHub Desktop**.

   ![GitHub — Code button dropdown with "Open with GitHub Desktop"](/images/process/github-open-with-desktop.png)

   _Red arrow: **Open with GitHub Desktop** in the Code dropdown — launches GitHub Desktop with this repo's clone dialog already filled in, no URL to paste._

5. GitHub Desktop opens (sign in with your GitHub account if this is the first time). Choose — or accept the default — local path, then click **Clone**.
6. Once cloning finishes, click **Show in Finder** (Mac) or **Show in Explorer** (Windows) to see the folder. Note this location — it's the folder Claude or Codex Desktop needs to be pointed at in the next step.

## Option B — Terminal / PowerShell

GitHub no longer accepts your account password for `git clone`, and personal access tokens are often blocked or restricted by org policy — in practice, an **SSH key** is the most reliable way to authenticate from a terminal. Set it up once; every future clone/pull/push on that machine just works, no login prompts.

1. Open a terminal:

   | OS      | How                                              |
   | ------- | ------------------------------------------------ |
   | macOS   | Press `⌘ Space`, type `Terminal`, press Enter.   |
   | Windows | Click **Start**, type `PowerShell`, press Enter. |

2. Check whether Git is already installed by typing `git --version` and pressing Enter.
   - If it prints a version number, skip to step 3.
   - If it says something like `command not found` or `'git' is not recognized`, install Git from https://git-scm.com/downloads, accepting the installer defaults, then reopen the terminal and try `git --version` again.
3. Generate an SSH key (skip this step if you already have one — check by typing `ls ~/.ssh/id_ed25519.pub`):

   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

   Press Enter to accept the default file location, and Enter again twice to skip the passphrase (or set one if you prefer).

4. Copy the public key to your clipboard:

   ```bash
   # macOS
   pbcopy < ~/.ssh/id_ed25519.pub
   ```

   ```powershell
   # Windows
   Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
   ```

5. Add it to GitHub: go to https://github.com/settings/keys → **New SSH key** → paste into **Key** → give it a title (e.g. your laptop's name) → **Add SSH key**.
6. Test the connection:

   ```bash
   ssh -T git@github.com
   ```

   The first time, it asks to confirm GitHub's host fingerprint — type `yes`. A message like `Hi <username>! You've successfully authenticated` means it worked.

7. Clone the repo using the SSH URL (note: `git@github.com:...`, not `https://`) and move into it:

   ```bash
   git clone git@github.com:[[GITHUB_ORG]]/[[GITHUB_REPO]].git
   cd [[GITHUB_REPO]]
   ```

## Confirm it worked

Whichever option you used, open the cloned folder and check it contains a `CLAUDE.md` file and a `docs` folder. If you used the terminal, `ls` (Mac) or `dir` (Windows) lists the folder contents.

## Troubleshooting

| Symptom                                                                               | Fix                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git: command not found` / `'git' is not recognized`                                  | Git isn't installed — install it (Option B, step 2), or use GitHub Desktop (Option A) instead, which doesn't require Git to be installed separately.                                                                                                                                                                                                 |
| GitHub Desktop opens a browser window asking to authorize                             | Normal — click **Authorize**, then go back to GitHub Desktop; the clone continues on its own.                                                                                                                                                                                                                                                        |
| `Support for password authentication was removed`                                     | GitHub no longer accepts your account password for `git clone` over HTTPS. Set up an SSH key instead (Option B, steps 3–7) — this is the reliable path, not a one-off workaround.                                                                                                                                                                    |
| Cloning over HTTPS asks for a personal access token, or one you generate doesn't work | Some orgs restrict or block personal access tokens entirely. Don't debug the token — switch to SSH (Option B, steps 3–7); it isn't subject to the same restriction.                                                                                                                                                                                  |
| `remote: Write access to repository not granted` / `403` on `git clone` over HTTPS    | This wording is misleading — it's not really about write access. It means Git is authenticating with a credential that isn't the one your GitHub access was just granted on (an old cached login, or a blocked token). Switch to SSH (Option B, steps 3–7) rather than troubleshooting the HTTPS credential — that's what resolved this in practice. |
| `Permission denied (publickey)` on `git clone` over SSH                               | The SSH key either wasn't added to your GitHub account, or doesn't match the one on this machine. Re-run `ssh -T git@github.com` (Option B, step 6) — if it doesn't greet you by username, redo steps 3–5.                                                                                                                                           |
| `Permission denied` or `repository not found`                                         | You're either not signed into the right GitHub account, or not yet added to the [[GITHUB_ORG]] organization — check with the engagement lead.                                                                                                                                                                                                        |

→ Continue with [Claude Desktop Setup](./02%20Claude%20Desktop%20Setup.md) or [Codex Desktop Setup](./03%20Codex%20Desktop%20Setup.md).
