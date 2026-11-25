# Distribution and releases

## Local development

Use the checked-in `.agents/plugins/marketplace.json`. Each entry points at a self-contained plugin under `plugins/`. Install or refresh after edits; installed caches may not follow source edits automatically.

## Git marketplace

Start with the repository-local entries and a full Git checkout. To generate a manifest with explicit Git-backed subdirectory sources for separately fetched plugins, run:

```bash
python3 tooling/manage.py remote-marketplace --url https://github.com/YOUR-ORG/organization-harness.git --ref v0.2.0
```

The generated manifest is written to `dist/marketplace.remote.json` for review; it does not overwrite the checked-in catalogue. Use an existing branch/tag or immutable commit. The command does not publish anything. When using this generated manifest, ensure the Git source and ref are reachable by the installing user and that the marketplace snapshot contains the intended manifest.

## Organization distribution

Use the organization's supported managed marketplace or plugin sharing mechanism, subject to workspace plan, administrator policies and private Git authentication. A Git URL alone does not publish a plugin to the universal ChatGPT directory or guarantee cloud synchronization. Start with a small pilot, test private-repo access and confirm which surfaces support the skills. Individual plugin ZIPs can be produced for compatible distribution channels; submission may require additional metadata, review or packaging.

## Release workflow

1. Review skill and policy changes; run scenario evaluations in the target agent.
2. Update versions in affected `plugin.json` files (the repo-local marketplace resolves from source and does not duplicate versions).
3. Run `sync`, commit generated copies, then run structural validation and packaging.
4. Commit and tag the intended release, or pin each remote plugin to a tested ref.
5. Refresh/install from the target marketplace and smoke test each changed plugin.

The CI workflow validates pull requests and builds individual ZIPs on version-tag pushes. It does not publish to an external marketplace. Introduce Nx/semantic-release when dependency graphs, affected builds or independent releases justify it.

## References

- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/build/skills
- https://agentskills.io/
