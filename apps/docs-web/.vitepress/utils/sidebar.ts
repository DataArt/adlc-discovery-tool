import { readdirSync, type Dirent } from 'node:fs';
import { resolve } from 'node:path';
import type { DefaultTheme } from 'vitepress';
import { DOCS_ROOT } from './constants';

const prettify = (name: string) => name.replace(/^\d+\s+/, '');

export interface ScanSectionOptions {
  level?: number;
  collapseAfter?: number;
  exclude?: string[];
}

export function scanSection(
  rel: string,
  { level = 0, collapseAfter = 1, exclude = [] }: ScanSectionOptions = {}
): DefaultTheme.SidebarItem[] {
  try {
    const entries = readdirSync(resolve(DOCS_ROOT, rel), { withFileTypes: true });
    const files = entries
      .filter(
        (d) => !d.isDirectory() && d.name.endsWith('.md') && !/^(index|README)\.md$/i.test(d.name)
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((d) => ({
        text: prettify(d.name.replace(/\.md$/, '')),
        link: `/${rel}/${d.name.replace(/\.md$/, '')}`,
      }));
    const dirs = entries
      .filter((d) => d.isDirectory() && !exclude.includes(d.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((d) => ({
        text: prettify(d.name),
        items: scanSection(`${rel}/${d.name}`, { level: level + 1, collapseAfter }),
      }))
      .filter((d) => d.items.length > 0)
      .map((d) => ({ ...d, collapsed: level >= collapseAfter }));
    return [...files, ...dirs];
  } catch {
    return [];
  }
}

/** Relative paths (posix, no leading slash) of every directory under docs/ that has an index.md or README.md — used to tell breadcrumb segments with a real page from bare folders. */
export function collectIndexedDirs(rel = ''): string[] {
  let entries: Dirent[];
  try {
    entries = readdirSync(resolve(DOCS_ROOT, rel), { withFileTypes: true });
  } catch {
    return [];
  }
  const hasIndex = entries.some((d) => !d.isDirectory() && /^(index|README)\.md$/i.test(d.name));
  const result = hasIndex ? [rel] : [];
  for (const d of entries) {
    if (d.isDirectory()) {
      result.push(...collectIndexedDirs(rel ? `${rel}/${d.name}` : d.name));
    }
  }
  return result;
}
