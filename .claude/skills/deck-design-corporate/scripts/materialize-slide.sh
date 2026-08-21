#!/usr/bin/env bash
# materialize-slide.sh <template-num> <deck-name> <slide-index> <slide-slug>
#
# Copies a kit template into tmp/decks/<deck-name>/ with the correct
# relative paths and a sane page-number, leaving the agent to fill in
# the <!-- TODO: replace --> blocks.
#
# Why a script: every slide otherwise needs the same 5-step manual
# procedure (cp → fix paths → set page-number → save). Bundling it here
# means the path arithmetic is computed once, deterministically, and the
# agent does not retype the same edits per slide.
#
# Arguments:
#   <template-num>   two-digit (01..15), matches kit/templates/NN-*.html
#   <deck-name>      slug-safe directory name under tmp/decks/
#   <slide-index>    two-digit slide ordinal, used in filename and page-number
#   <slide-slug>     slug-safe per-slide name (no spaces)
#
# Output:
#   tmp/decks/<deck-name>/slide-<slide-index>-<slide-slug>.html
#
# Exit codes:
#   0  copied successfully (prints the new absolute path on stdout)
#   1  bad arguments
#   2  template not found / ambiguous
#   3  target already exists (no overwrite — fail loudly)
#   4  kit not found

set -euo pipefail

usage () {
  cat >&2 <<'EOF'
materialize-slide: usage:
  scripts/materialize-slide.sh <template-num> <deck-name> <slide-index> <slide-slug>

Examples:
  scripts/materialize-slide.sh 01 acme-pitch 01 cover
  scripts/materialize-slide.sh 03 acme-pitch 04 why-now
EOF
}

if [ $# -ne 4 ]; then
  usage
  exit 1
fi

tpl_num="$1"
deck_name="$2"
slide_idx="$3"
slide_slug="$4"

# --- validate arguments ------------------------------------------------
if [[ ! "$tpl_num" =~ ^(0[1-9]|1[0-9]|20)$ ]]; then
  echo "materialize-slide: template-num must be 01..20 (got: $tpl_num)" >&2
  exit 1
fi
if [[ ! "$deck_name" =~ ^[a-z0-9][a-z0-9_-]*$ ]]; then
  echo "materialize-slide: deck-name must be slug-safe (lowercase, [a-z0-9_-]): got '$deck_name'" >&2
  exit 1
fi
if [[ ! "$slide_idx" =~ ^[0-9]{2}$ ]]; then
  echo "materialize-slide: slide-index must be two-digit (e.g. 01, 07): got '$slide_idx'" >&2
  exit 1
fi
if [[ ! "$slide_slug" =~ ^[a-z0-9][a-z0-9_-]*$ ]]; then
  echo "materialize-slide: slide-slug must be slug-safe (lowercase, [a-z0-9_-]): got '$slide_slug'" >&2
  exit 1
fi

# --- locate kit ---------------------------------------------------------
# find-kit.sh handles the AIMS64-monorepo vs bundled-standalone split
# (probes $DECK_KIT_ROOT → <skill-dir>/kit-corporate/ → ancestor /kit-corporate/).
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! kit="$(bash "$script_dir/find-kit.sh")"; then
  echo "materialize-slide: could not locate the kit (see find-kit.sh output above)" >&2
  exit 4
fi
templates_dir="$kit/templates"

if [ ! -d "$templates_dir" ]; then
  echo "materialize-slide: kit templates not found at $templates_dir" >&2
  exit 4
fi

# --- find the template -------------------------------------------------
matches=( "$templates_dir/$tpl_num-"*.html )
if [ ! -e "${matches[0]}" ]; then
  echo "materialize-slide: no template starts with '$tpl_num-' in $templates_dir" >&2
  exit 2
fi
if [ "${#matches[@]}" -ne 1 ]; then
  echo "materialize-slide: ambiguous template prefix '$tpl_num-' matched ${#matches[@]} files" >&2
  exit 2
fi
src="${matches[0]}"

# --- compute destination -----------------------------------------------
# Output goes to the PROJECT dir (git root / cwd), never the skill folder —
# see resolve-output-dir.sh ($DECK_OUTPUT_ROOT → git root → cwd, then /decks).
output_root="$(bash "$script_dir/resolve-output-dir.sh")"

deck_dir="$output_root/$deck_name"
dest="$deck_dir/slide-$slide_idx-$slide_slug.html"

if [ -e "$dest" ]; then
  echo "materialize-slide: refusing to overwrite existing file $dest" >&2
  echo "  rm it first if you really mean to regenerate" >&2
  exit 3
fi

mkdir -p "$deck_dir"

# --- compute kit-relative prefix --------------------------------------
# Templates link ../shared/* and ../assets/*; for an output file in
# $deck_dir, we need the relative path from $deck_dir to $kit so the
# rewritten links resolve correctly regardless of where the deck output
# lives. Python's os.path.relpath is portable across macOS / Linux.
rel_to_kit="$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))" "$kit" "$deck_dir")"

# --- rewrite paths + set page-number ----------------------------------
# Page-number markup in templates is shaped like
#   <p class="layer page-number is-dark-bg"><!-- TODO: replace -->18</p>
# so we need a class-substring match (not exact equality) and a lazy
# content match that can span the TODO comment. Perl handles the lazy
# regex cleanly.

perl -pe '
  s|"\.\./shared/|"'"$rel_to_kit"'/shared/|g;
  s|'\''\.\./shared/|'\'''"$rel_to_kit"'/shared/|g;
  s|"\.\./assets/|"'"$rel_to_kit"'/assets/|g;
  s|'\''\.\./assets/|'\'''"$rel_to_kit"'/assets/|g;
  s|(<p\s[^>]*class="[^"]*\bpage-number\b[^"]*"[^>]*>).*?</p>|${1}'"$slide_idx"'</p>|g;
' "$src" > "$dest"

# Strip the leading instructional HTML comment block between <!doctype html>
# and <html ...>. Templates embed the literal token `<!-- TODO: replace -->`
# inside their how-to-use header, which is INVALID inside an HTML comment —
# the first inner `-->` terminates the outer comment, and the rest of the
# header bleeds into the rendered slide as visible text. Stripping the
# block at materialize-time removes the bug class entirely for new decks.
# Same for any `<!-- pattern: … -->` banner that templates place
# immediately after <body>.
python3 - "$dest" <<'PY'
import re
import sys
from pathlib import Path

p = Path(sys.argv[1])
s = p.read_text(encoding="utf-8")
s = re.sub(
    r"(<!doctype html>\s*)<!--.*?-->\s*(<html\b)",
    r"\1\2",
    s,
    count=1,
    flags=re.DOTALL | re.IGNORECASE,
)
s = re.sub(
    r"(<body>\s*)<!--\s*pattern:.*?-->\s*",
    r"\1",
    s,
    count=1,
    flags=re.DOTALL | re.IGNORECASE,
)
p.write_text(s, encoding="utf-8")
PY

# --- sanity check ------------------------------------------------------
if grep -q '"\.\./shared/' "$dest" 2>/dev/null \
   || grep -q "'\.\./shared/" "$dest" 2>/dev/null; then
  echo "materialize-slide: WARNING — '../shared/' still present after rewrite" >&2
  echo "  (check $dest manually)" >&2
fi

# Cover templates intentionally carry no page-number, so only warn when
# the source template had one and it failed to rewrite.
if grep -Eq 'class="[^"]*page-number[^"]*"' "$src" 2>/dev/null; then
  if ! grep -Eq "class=\"[^\"]*page-number[^\"]*\"[^>]*>$slide_idx</p>" "$dest" 2>/dev/null; then
    echo "materialize-slide: WARNING — page-number was not set to '$slide_idx'" >&2
    echo "  (check the .page-number markup in $dest)" >&2
  fi
fi

# --- done --------------------------------------------------------------
echo "$dest"
echo "  template: $(basename "$src")" >&2
echo "  page-number set to: $slide_idx" >&2
echo "  serve from: a directory that contains both the kit and the output," >&2
echo "              e.g.: cd $(dirname "$kit") && python3 -m http.server 4180" >&2
echo "  next: replace every '<!-- TODO: replace -->' block with real content" >&2
