# Set up specialists

Use the packaged definitions to explain or select roles:

- [Business analyst](../../../agents/business-analyst.toml) identifies actors, outcomes, contradictions and gaps.
- [Requirements reviewer](../../../agents/requirements-reviewer.toml) checks traceability, scope and testability.
- [Researcher](../../../agents/researcher.toml) gathers and cross-checks evidence.
- [Reviewer](../../../agents/reviewer.toml) checks a deliverable against stated criteria.
- [Documentation specialist](../../../agents/documentation-specialist.toml) reviews structure and terminology.

For an inventory request, describe the roles and stop. For installation:

1. Confirm that the host supports project agents and resolve the user's target project. Default to its `.codex/agents/` directory. Use personal scope only when explicitly selected.
2. Compare the selected TOML files with the destination. Preview additions, identical files to skip, and conflicts with a diff. Mention that the templates inherit the host model and request high reasoning effort. Roles inherit host permissions and connector access.
3. Apply approved additions. Preserve customized files unless the user approves the specific replacement after seeing the diff and backup option.
4. Read back the installed files. Report file installation separately from runtime discovery. Check discovery if the host exposes it, or explain how to check in a fresh session.
5. Where registration is unavailable, the role instructions can guide a sequential review. Use generic delegation only when supported and authorized.
