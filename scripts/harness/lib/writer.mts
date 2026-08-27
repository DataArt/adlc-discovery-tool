import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve, sep } from 'node:path';

import { ROOT } from './common.mts';

function isWithin(root: string, absoluteTarget: string): boolean {
  const rootWithSep = root.endsWith(sep) ? root : `${root}${sep}`;
  return absoluteTarget === root || absoluteTarget.startsWith(rootWithSep);
}

/** Tracks whether any projection differs from what's on disk, across every
 *  provider run in this invocation — the orchestrator reads `.drift` once at
 *  the end to decide the process exit code.
 *
 *  Every mutation is gated on `allowedRoots`, the manifest's own declared
 *  provider output paths (validated up front by `validateManifest`) — not
 *  merely "somewhere inside the repository". A wrong manifest value, or a bug
 *  anywhere upstream, can still land an absolute path here; this is the one
 *  place that refuses to act on it regardless of where it came from. */
export class Writer {
  private driftDetected = false;

  constructor(
    private readonly checkMode: boolean,
    private readonly allowedRoots: readonly string[]
  ) {}

  get drift(): boolean {
    return this.driftDetected;
  }

  write(target: string, content: Buffer | string): void {
    const absolute = this.resolveWithinAllowedRoot(target);
    const current = existsSync(absolute) ? readFileSync(absolute) : undefined;
    const wanted = Buffer.isBuffer(content) ? content : Buffer.from(content);
    if (current?.equals(wanted)) return;

    this.driftDetected = true;
    if (this.checkMode) {
      console.error(`out of date: ${target}`);
      return;
    }

    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, wanted);
    console.log(`generated ${target}`);
  }

  remove(target: string): void {
    const absolute = this.resolveWithinAllowedRoot(target);
    this.driftDetected = true;
    if (this.checkMode) {
      console.error(`obsolete: ${target}`);
      return;
    }
    unlinkSync(absolute);
    console.log(`removed obsolete ${target}`);
  }

  /** Removes `target` only if it's an empty directory — used after pruning a
   *  generated tree's stale files, so a deleted skill's now-empty folder doesn't
   *  linger. Silently no-ops on anything that isn't an empty directory. */
  removeEmptyDir(target: string): void {
    const absolute = this.resolveWithinAllowedRoot(target);
    if (!existsSync(absolute) || readdirSync(absolute).length > 0) return;

    this.driftDetected = true;
    if (this.checkMode) {
      console.error(`obsolete empty directory: ${target}`);
      return;
    }
    rmdirSync(absolute);
    console.log(`removed empty directory ${target}`);
  }

  private resolveWithinAllowedRoot(target: string): string {
    const absolute = resolve(ROOT, target);
    if (!isWithin(ROOT, absolute)) {
      throw new Error(`Refusing to write outside the repository root: ${target}`);
    }
    const withinAllowedRoot = this.allowedRoots.some((root) =>
      isWithin(resolve(ROOT, root), absolute)
    );
    if (!withinAllowedRoot) {
      throw new Error(`Refusing to write outside a declared generated root: ${target}`);
    }
    return absolute;
  }
}
