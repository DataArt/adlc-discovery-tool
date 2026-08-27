import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

import { ROOT, generatedText, replaceLiteral } from './common.mts';
import type { Manifest, McpDocument, ProviderPaths } from './types.mts';
import type { Writer } from './writer.mts';

const SKILLS_ROOT_TOKEN = '__HARNESS_SKILLS_ROOT__';
const SKILLS_ROOT_SLASH_TOKEN = '__HARNESS_SKILLS_ROOT_SLASH__';
const AGENTS_ROOT_TOKEN = '__HARNESS_AGENTS_ROOT__';
const AGENTS_ROOT_SLASH_TOKEN = '__HARNESS_AGENTS_ROOT_SLASH__';

/**
 * One subclass per coding-tool target. `generate.mts` never branches on a
 * provider name — it instantiates the right subclass from a registry and
 * calls `generate()`, which is a template method: the skeleton (instructions,
 * skills, agents, mcp) is fixed here; each provider only supplies the three
 * hooks that actually differ (`transformMarkdown`, `writeAgents`, `writeMcp`).
 */
export abstract class HarnessProvider {
  abstract readonly name: string;

  constructor(
    protected readonly manifest: Manifest,
    protected readonly paths: ProviderPaths,
    protected readonly skillNames: string[],
    protected readonly writer: Writer
  ) {}

  generate(instructions: string, mcpDocument: McpDocument, mcpRaw: string): void {
    this.writeInstructions(instructions);
    this.syncTree(this.manifest.canonical.skills, this.paths.skills);
    this.writeAgents();
    this.writeMcp(mcpDocument, mcpRaw);
  }

  protected abstract transformMarkdown(content: string): string;
  protected abstract writeAgents(): void;
  protected abstract writeMcp(document: McpDocument, mcpRaw: string): void;

  /** Root-token substitution always brackets a provider's own rewrites: tokens are
   *  masked to opaque placeholders *before* `transformMarkdown` runs and resolved to
   *  real paths *after*. This ordering is load-bearing — a provider's invocation-prefix
   *  rewrite (e.g. `/dev` -> `$dev`) must never see an already-resolved path like
   *  `.agents/skills/dev-plan/...`, or it would corrupt the path itself. */
  protected renderMarkdown(content: string): string {
    const masked = this.maskRootTokens(content);
    const transformed = this.transformMarkdown(masked);
    return this.resolveRootTokens(transformed);
  }

  /** Renders `sourceRoot` into `targetRoot` and then deletes anything under
   *  `targetRoot` that no longer has a canonical source — a rename or deletion
   *  in `.harness/` must not leave stale files behind in a provider's tree. */
  protected syncTree(sourceRoot: string, targetRoot: string): void {
    const expected = new Set<string>();
    this.renderTree(sourceRoot, targetRoot, expected);
    this.pruneTree(targetRoot, expected);
  }

  /** Deletes every file under `targetRoot` whose resolved absolute path isn't in
   *  `expected`, then removes any directory left empty by that pruning. Scoped to
   *  whatever `targetRoot` the caller passes — always a provider's own declared
   *  output directory, never an arbitrary path. */
  protected pruneTree(targetRoot: string, expected: ReadonlySet<string>): void {
    const targetAbsolute = resolve(ROOT, targetRoot);
    if (!existsSync(targetAbsolute)) return;
    for (const entry of readdirSync(targetAbsolute, { withFileTypes: true })) {
      const target = join(targetRoot, entry.name);
      if (entry.isDirectory()) {
        this.pruneTree(target, expected);
        this.writer.removeEmptyDir(target);
        continue;
      }
      if (!entry.isFile()) continue;
      if (expected.has(resolve(ROOT, target))) continue;
      this.writer.remove(target);
    }
  }

  private renderTree(sourceRoot: string, targetRoot: string, expected: Set<string>): void {
    const sourceAbsolute = resolve(ROOT, sourceRoot);
    for (const entry of readdirSync(sourceAbsolute, { withFileTypes: true })) {
      const source = join(sourceAbsolute, entry.name);
      const target = join(targetRoot, entry.name);
      if (entry.isDirectory()) {
        this.renderTree(relative(ROOT, source), target, expected);
        continue;
      }
      if (!entry.isFile()) continue;

      expected.add(resolve(ROOT, target));
      const raw = readFileSync(source);
      if (extname(entry.name).toLowerCase() !== '.md') {
        // Only Markdown prose is templated or provider-rewritten. Everything else
        // (scripts, structured config, binary assets) is copied byte-for-byte, so
        // a provider's text substitutions (e.g. Codex's `/skill` -> `$skill`, or
        // `$ARGUMENTS` -> prose) can never reach executable code or structured data.
        this.writer.write(target, raw);
        continue;
      }
      const relSource = relative(ROOT, source);
      const rendered = this.renderMarkdown(raw.toString('utf8'));
      this.writer.write(target, generatedText(relSource, raw.toString('utf8'), rendered));
    }
  }

  private writeInstructions(instructions: string): void {
    this.writer.write(
      this.paths.instructions,
      generatedText(
        this.manifest.canonical.instructions,
        instructions,
        this.renderMarkdown(instructions)
      )
    );
  }

  private maskRootTokens(content: string): string {
    let masked = replaceLiteral(content, '{{skills_root}}/', SKILLS_ROOT_SLASH_TOKEN);
    masked = replaceLiteral(masked, '{{agents_root}}/', AGENTS_ROOT_SLASH_TOKEN);
    masked = replaceLiteral(masked, '{{skills_root}}', SKILLS_ROOT_TOKEN);
    return replaceLiteral(masked, '{{agents_root}}', AGENTS_ROOT_TOKEN);
  }

  private resolveRootTokens(content: string): string {
    let resolved = replaceLiteral(content, SKILLS_ROOT_SLASH_TOKEN, `${this.paths.skills}/`);
    resolved = replaceLiteral(resolved, AGENTS_ROOT_SLASH_TOKEN, `${this.paths.agents}/`);
    resolved = replaceLiteral(resolved, SKILLS_ROOT_TOKEN, this.paths.skills);
    return replaceLiteral(resolved, AGENTS_ROOT_TOKEN, this.paths.agents);
  }
}
