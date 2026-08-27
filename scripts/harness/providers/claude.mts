import { HarnessProvider } from '../lib/harness-provider.mts';
import type { McpDocument } from '../lib/types.mts';

export class ClaudeProvider extends HarnessProvider {
  readonly name = 'claude';

  protected transformMarkdown(content: string): string {
    // Canonical skill/agent prose is already authored in Claude's own vocabulary
    // (slash invocation, "Claude Code" naming) — nothing to rewrite for this provider.
    return content;
  }

  protected writeAgents(): void {
    this.syncTree(this.manifest.canonical.agents, this.paths.agents);
  }

  protected writeMcp(document: McpDocument): void {
    // Claude reads plain JSON with no provenance stamp — the raw canonical
    // bytes aren't needed here, only for Codex's generated-file header.
    this.writer.write(this.paths.mcp, `${JSON.stringify(document, null, 2)}\n`);
  }
}
