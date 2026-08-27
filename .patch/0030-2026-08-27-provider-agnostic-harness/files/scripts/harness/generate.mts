// Regenerates every coding-tool projection from the canonical `.harness/` harness.
// Adding a provider means adding a `HarnessProvider` subclass under `providers/`
// and registering its constructor in PROVIDER_CLASSES — this file never branches
// on a provider name.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

import {
  ROOT,
  collectOutputRoots,
  loadManifest,
  loadSkillNames,
  validateManifest,
} from './lib/common.mts';
import type { HarnessProvider } from './lib/harness-provider.mts';
import type { Manifest, McpDocument, ProviderPaths } from './lib/types.mts';
import { Writer } from './lib/writer.mts';
import { ClaudeProvider } from './providers/claude.mts';
import { CodexProvider } from './providers/codex.mts';

type ProviderConstructor = new (
  manifest: Manifest,
  paths: ProviderPaths,
  skillNames: string[],
  writer: Writer
) => HarnessProvider;

const PROVIDER_CLASSES: Record<string, ProviderConstructor> = {
  claude: ClaudeProvider,
  codex: CodexProvider,
};

const HELP_TEXT = `Usage: yarn harness:generate [options]

Options:
  --provider <name>  Generate only one provider (claude or codex). Repeatable.
  --check            Check selected projections without writing them.
  -h, --help         Show this help.

With no --provider option, all providers are generated.`;

interface Cli {
  check: boolean;
  help: boolean;
  providers?: string[];
}

function parseCli(): Cli {
  const { values } = parseArgs({
    options: {
      check: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
      provider: { type: 'string', multiple: true },
    },
  });
  return { check: values.check ?? false, help: values.help ?? false, providers: values.provider };
}

function resolveRequestedProviders(manifest: Manifest, requested: string[]): string[] {
  for (const name of requested) {
    if (!manifest.providers[name]) throw new Error(`Unknown provider: ${name}`);
    if (!PROVIDER_CLASSES[name]) throw new Error(`No provider class registered for: ${name}`);
  }
  return requested;
}

function loadCanonicalInputs(manifest: Manifest): {
  instructions: string;
  mcpRaw: string;
  mcpDocument: McpDocument;
} {
  const instructions = readFileSync(resolve(ROOT, manifest.canonical.instructions), 'utf8');
  const mcpRaw = readFileSync(resolve(ROOT, manifest.canonical.mcp), 'utf8');
  return { instructions, mcpRaw, mcpDocument: JSON.parse(mcpRaw) as McpDocument };
}

function runProvider(
  name: string,
  manifest: Manifest,
  skillNames: string[],
  writer: Writer,
  instructions: string,
  mcpDocument: McpDocument,
  mcpRaw: string
): void {
  const ProviderClass = PROVIDER_CLASSES[name];
  const provider = new ProviderClass(manifest, manifest.providers[name], skillNames, writer);
  provider.generate(instructions, mcpDocument, mcpRaw);
}

function reportResult(check: boolean, writer: Writer): void {
  if (check && writer.drift) process.exitCode = 1;
  if (!writer.drift) {
    console.log(check ? 'harness projections are current' : 'harness already current');
  }
}

function main(): void {
  const cli = parseCli();
  if (cli.help) {
    console.log(HELP_TEXT);
    return;
  }

  const manifest = loadManifest();
  validateManifest(manifest);
  const requested = resolveRequestedProviders(
    manifest,
    cli.providers ?? Object.keys(manifest.providers)
  );
  const skillNames = loadSkillNames(manifest);
  const writer = new Writer(cli.check, collectOutputRoots(manifest));
  const { instructions, mcpRaw, mcpDocument } = loadCanonicalInputs(manifest);

  for (const name of requested) {
    runProvider(name, manifest, skillNames, writer, instructions, mcpDocument, mcpRaw);
  }

  reportResult(cli.check, writer);
}

main();
