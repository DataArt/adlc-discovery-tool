#!/usr/bin/env bash
# materialize-deck.sh <deck-name>   (plan on stdin)
#
# BATCH materializer: forks every slide of a deck in ONE call, instead of one
# materialize-slide.sh call per slide. Templates are referenced by NAME (the
# basename without .html — e.g. `cover`, `content-cards`, `asis-fastfacts`),
# matching the Corporate kit's filenames (it has no numeric NN- prefixes).
#
# Plan format — one line per slide on stdin, whitespace-separated:
#     <NN> <template-name> <slug>
#   e.g.
#     01 cover           cover
#     02 asis-fastfacts  fast-facts
#     03 content-cards   why-now
#   (blank lines and #comments are ignored)
#
# For each slide it copies kit-corporate/templates/<template-name>.html into
# tmp/decks/<deck-name>/slide-<NN>-<slug>.html, rewrites ../shared & ../assets
# to the correct relative path, sets the page-number to NN, and strips the
# leading how-to comment block. Same per-slide result as materialize-slide.sh.
#
# Exit: 0 ok · 1 bad args · 2 a template was missing · 4 kit not found.
set -uo pipefail

if [ $# -ne 1 ]; then
  echo "usage: materialize-deck.sh <deck-name>   (plan: '<NN> <template-name> <slug>' lines on stdin)" >&2
  exit 1
fi
deck_name="$1"
if [[ ! "$deck_name" =~ ^[a-z0-9][a-z0-9_-]*$ ]]; then
  echo "materialize-deck: deck-name must be slug-safe (lowercase [a-z0-9_-]): '$deck_name'" >&2
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! kit="$(bash "$script_dir/find-kit.sh")"; then
  echo "materialize-deck: could not locate the kit" >&2; exit 4
fi
templates_dir="$kit/templates"
[ -d "$templates_dir" ] || { echo "materialize-deck: no templates at $templates_dir" >&2; exit 4; }

# Output goes to the PROJECT dir (git root / cwd), never the skill folder.
output_root="$(bash "$script_dir/resolve-output-dir.sh")"
deck_dir="$output_root/$deck_name"
mkdir -p "$deck_dir"
rel_to_kit="$(python3 -c "import os,sys;print(os.path.relpath(sys.argv[1],sys.argv[2]))" "$kit" "$deck_dir")"

made=0 errors=0
while read -r idx tname slug _rest; do
  [ -z "${idx:-}" ] && continue
  case "$idx" in \#*) continue;; esac
  if [[ ! "$idx" =~ ^[0-9]{2,3}$ ]] || [ -z "${tname:-}" ] || [ -z "${slug:-}" ]; then
    echo "materialize-deck: skipping bad plan line: '$idx $tname $slug'" >&2; errors=$((errors+1)); continue
  fi
  src="$templates_dir/$tname.html"
  if [ ! -f "$src" ]; then
    echo "materialize-deck: template not found: $tname.html" >&2; errors=$((errors+1)); continue
  fi
  dest="$deck_dir/slide-$idx-$slug.html"
  perl -pe '
    s|"\.\./shared/|"'"$rel_to_kit"'/shared/|g;
    s|'\''\.\./shared/|'\'''"$rel_to_kit"'/shared/|g;
    s|"\.\./assets/|"'"$rel_to_kit"'/assets/|g;
    s|'\''\.\./assets/|'\'''"$rel_to_kit"'/assets/|g;
    s|(<p\s[^>]*class="[^"]*\bpage-number\b[^"]*"[^>]*>).*?</p>|${1}'"$idx"'</p>|g;
  ' "$src" > "$dest"
  python3 - "$dest" <<'PY'
import re,sys
from pathlib import Path
p=Path(sys.argv[1]); s=p.read_text(encoding="utf-8")
s=re.sub(r"(<!doctype html>\s*)<!--.*?-->\s*(<html\b)", r"\1\2", s, count=1, flags=re.DOTALL|re.IGNORECASE)
s=re.sub(r"(<body>\s*)<!--\s*pattern:.*?-->\s*", r"\1", s, count=1, flags=re.DOTALL|re.IGNORECASE)
p.write_text(s, encoding="utf-8")
PY
  made=$((made+1))
  echo "  slide-$idx-$slug.html  ← $tname.html"
done

echo "materialize-deck: $made slide(s) → $deck_dir${errors:+  ($errors error(s))}"
echo "  next: replace the <!-- TODO: replace --> blocks with real content, then verify."
[ "$errors" -eq 0 ] || exit 2
