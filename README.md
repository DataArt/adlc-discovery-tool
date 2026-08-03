# ADLC Discovery Tool

A DataArt starter kit for AI SDLC discovery engagements — clone it, run one bootstrap step, and get a working, client-branded discovery engagement: methodology, workshop programme, deployable docs site, and the engineering harness that structures how the team works.

## What this brings

- **Connect Framework methodology** — the Goals · Problem Space · Solution Space · Milestones facilitation arc that structures every engagement, from first discovery through pilot delivery
- **A Vision-building workshop programme** — short, focused sessions that build a shared picture of the client's current state, future state, and the solution hypotheses in between
- **A deployable docs site** — VitePress, served via CloudFront + S3, gated behind Lambda@Edge basic auth, with AWS CDK infrastructure and CI/CD (GitHub Actions + OIDC) included
- **An engineering harness** — Claude Code skills, agents, and lifecycles (`/dev`, `/design`, `/war`) that structure how design and implementation work actually gets done
- **One-command bootstrap** — `/bootstrap-client` personalizes the whole kit for a new client deterministically, not by hand-editing files

## Launching a new client engagement

```bash
git clone https://github.com/DataArt/adlc-discovery-tool.git {client-repo-name}   # clone the starter kit
cd {client-repo-name}
git remote remove origin   # detach from this tool's own repo
# create an initial commit and push it to the new engagement's own repo — GitHub, GitLab,
# Azure DevOps, Bitbucket, etc. — host is up to the team, not this starter kit's concern
```

```bash
nvm install 24     # installs and switches to Node 24
corepack enable     # activates Yarn 4 via the packageManager field
yarn install        # installs all workspace deps
```

Then, inside Claude Code:

```
/bootstrap-client
```

It walks through a short Q&A — client name, org prefix, AWS region, GitHub org/repo, Giscus setup — and applies everything deterministically via a script, not free-text generation.

→ See `QUICK-SETUP-GUIDE.md` for the full path from empty clone to a live, deployed instance (prerequisites through CI/CD).

## Contributing / local development

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Documentation

| Path                              | Purpose                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `docs/AI SDLC/`                   | Engagement methodology and content — Connect Framework, Vision, Problem/Solution Space |
| `docs/Engineering Guide/`         | Conventions, AI workflow, and operational runbooks                                     |
| `docs/Target Architecture (HLD)/` | This platform's own architecture                                                       |
