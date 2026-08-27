#!/usr/bin/env bash
# find-kit.sh
#
# Resolves the absolute path to the DataArt CORPORATE Slides Kit and prints it
# on stdout. Used by every other deck-design-corporate script so kit-location
# logic lives in exactly one place — and so the same skill folder works in two
# very different environments:
#
#   1. AIMS64 monorepo: the skill lives at agent/skills/deck-design-corporate/
#      and the kit at <repo>/kit-corporate/.
#   2. Standalone install: the skill was unzipped into a profile folder and
#      the kit was bundled alongside it as <skill-dir>/kit-corporate/ (or
#      <skill-dir>/kit/).
#
# This resolves the DataArt Corporate Slides Kit (1920x1080).
#
# Probe order:
#   1. $DECK_KIT_ROOT (env override)
#   2. <skill-dir>/kit-corporate/  then  <skill-dir>/kit/   (bundled standalone)
#   3. <ancestor>/kit-corporate/ — walk up from <skill-dir> looking for the
#                       corporate kit in any of the next 6 parent directories.
#
# A directory counts as a kit iff it contains shared/tokens.css.
#
# Exit codes:
#   0  printed an absolute path to a valid kit on stdout
#   1  could not resolve any kit; recovery instructions on stderr

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
skill_dir="$(cd "$script_dir/.." && pwd)"

is_kit () {
  local candidate="$1"
  [ -d "$candidate" ] && [ -f "$candidate/shared/tokens.css" ]
}

# --- probe 1: $DECK_KIT_ROOT -----------------------------------------
if [ -n "${DECK_KIT_ROOT:-}" ]; then
  if is_kit "$DECK_KIT_ROOT"; then
    cd "$DECK_KIT_ROOT" && pwd
    exit 0
  else
    echo "find-kit: \$DECK_KIT_ROOT points at $DECK_KIT_ROOT" >&2
    echo "  but that directory has no shared/tokens.css — not a valid kit" >&2
    exit 1
  fi
fi

# --- probe 2: bundled kit next to the skill --------------------------
# Prefer an explicitly-named corporate kit; fall back to a bundled kit/.
if is_kit "$skill_dir/kit-corporate"; then
  cd "$skill_dir/kit-corporate" && pwd
  exit 0
fi
if is_kit "$skill_dir/kit"; then
  cd "$skill_dir/kit" && pwd
  exit 0
fi

# --- probe 3: walk up looking for an ancestor with kit-corporate/ ----
current="$skill_dir"
for _ in 1 2 3 4 5 6; do
  current="$(dirname "$current")"
  if is_kit "$current/kit-corporate"; then
    cd "$current/kit-corporate" && pwd
    exit 0
  fi
done

# --- nothing found ---------------------------------------------------
cat >&2 <<EOF
find-kit: could not resolve a valid DataArt Corporate Slides Kit

Tried, in order:
  1. \$DECK_KIT_ROOT               (env var — not set)
  2. $skill_dir/kit-corporate  (bundled — not present)
     $skill_dir/kit            (bundled fallback — not present)
  3. parent directories of        (none had kit-corporate/shared/tokens.css)
     $skill_dir
     within 6 levels up

A directory counts as a kit when it contains shared/tokens.css.

Recovery — pick one:

  A. Set DECK_KIT_ROOT to the absolute path of your corporate kit:
       export DECK_KIT_ROOT=/absolute/path/to/kit-corporate

  B. Place the kit next to the skill folder so it lives at:
       $skill_dir/kit-corporate/shared/tokens.css

  C. If you're in the AIMS64 monorepo, ensure kit-corporate/ exists at the
     repo root (sibling of agent/).
EOF
exit 1
