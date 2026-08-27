#!/usr/bin/env bash
# resolve-output-dir.sh — print the deck OUTPUT directory (the `decks/` folder).
#
# Decks must land in the user's PROJECT directory — the place Claude Code / git
# was invoked from — and NEVER inside the skill folder. This matters most for the
# standalone `.skill` install, where the kit is bundled next to the skill: writing
# relative to the kit (the old `<kit-parent>/tmp/decks` behaviour) dropped decks
# straight into the skill folder.
#
# Resolution order:
#   1. $DECK_OUTPUT_ROOT          — explicit override, used verbatim as the decks dir
#   2. git project root of $PWD   — `git -C "$PWD" rev-parse --show-toplevel`
#   3. $PWD                       — the current working directory
#
# Prints the resolved directory (callers append `/<deck-name>/`).
set -euo pipefail

if [ -n "${DECK_OUTPUT_ROOT:-}" ]; then
  printf '%s\n' "$DECK_OUTPUT_ROOT"
  exit 0
fi

root="$(git -C "$PWD" rev-parse --show-toplevel 2>/dev/null || true)"
[ -n "$root" ] || root="$PWD"
printf '%s/decks\n' "$root"
