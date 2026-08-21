#!/usr/bin/env bash
# kit-overview.sh
#
# Prints a human-readable inventory of the DataArt Corporate Slides Kit:
#   - colour variables  (--c-*)
#   - typography classes (.txt-*)
#   - colour helper classes (.c-*)
#   - layout helper classes (.bg-*)
#   - every template under templates/ with its first <title> line
#
# Replaces ~30 lines of static prose in SKILL.md and ensures the agent
# always sees the live state of the kit, even if a kit file is edited.
#
# Exit codes:
#   0  printed inventory
#   1  kit directory could not be located

set -uo pipefail   # not -e: inventory greps tolerate empty sections (e.g.
                   # background layers may be absent in some kit revisions)

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Resolve kit location via the central probe helper, so this script works
# both in the AIMS64 monorepo and in a standalone install where the kit
# is bundled next to the skill.
if ! kit="$(bash "$script_dir/find-kit.sh")"; then
  echo "kit-overview: could not locate the kit (see find-kit.sh output above)" >&2
  exit 1
fi

if [ ! -d "$kit/shared" ] || [ ! -d "$kit/templates" ]; then
  echo "kit-overview: kit at $kit is incomplete (missing shared/ or templates/)" >&2
  exit 1
fi

tokens="$kit/shared/tokens.css"
layouts="$kit/shared/layouts.css"
components="$kit/shared/components.css"

print_section () {
  printf '\n=== %s ===\n' "$1"
}

print_section "kit location"
echo "  $kit"

# Strip comment lines before grepping so wildcards like `.bg-back-*` in
# CSS comments don't pollute the inventory. Also require the matched
# identifier to end in [a-z0-9], not '-'.
declarations_only () {
  local file="$1"
  # Drop /* ... */ blocks (single-line and multi-line).
  awk '
    BEGIN { incomment = 0 }
    {
      line = $0
      # naive multi-line comment stripper
      while (match(line, /\/\*.*\*\//)) {
        line = substr(line, 1, RSTART - 1) substr(line, RSTART + RLENGTH)
      }
      if (incomment) {
        if (match(line, /\*\//)) { incomment = 0; line = substr(line, RSTART + 2) }
        else next
      }
      if (match(line, /\/\*/)) {
        line = substr(line, 1, RSTART - 1)
        incomment = 1
      }
      print line
    }
  ' "$file"
}

ident_re='[a-z0-9-]*[a-z0-9]'

print_section "colour tokens (--c-*)"
declarations_only "$tokens" | grep -Eo -- "--c-$ident_re" | sort -u | sed 's/^/  /'

print_section "typography classes (.txt-*)"
declarations_only "$tokens" | grep -Eo "\.txt-$ident_re" | sort -u | sed 's/^/  /'

print_section "colour helpers (.c-*)"
declarations_only "$tokens" | grep -Eo "\.c-$ident_re" | sort -u | sed 's/^/  /'

print_section "background layers (.bg-*)"
{ declarations_only "$layouts" | grep -Eo "\.bg-$ident_re" 2>/dev/null || true; } | sort -u | sed 's/^/  /'

print_section "templates ($kit/templates/)"
for f in "$kit/templates"/*.html; do
  [ -f "$f" ] || continue
  name="$(basename "$f")"
  title="$(grep -Eo '<title>[^<]+</title>' "$f" | head -n1 | sed -E 's|<title>(.*)</title>|\1|')"
  printf '  %s  —  %s\n' "$name" "${title:-(no <title>)}"
done

print_section "templates count ($kit/templates/)"
count_refs="$(find "$kit/templates" -maxdepth 1 -name '*.html' -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "  $count_refs pixel-faithful template HTML files (read-only)"

print_section "asset directories ($kit/assets/)"
asset_dirs="$(find "$kit/assets" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')"
echo "  $asset_dirs slide-NN/ directories"

print_section "showcase"
[ -f "$kit/showcase/index.html" ] \
  && echo "  $kit/showcase/index.html (open in browser before drafting)" \
  || echo "  (showcase/index.html missing)"

echo
echo "kit-overview: done"
