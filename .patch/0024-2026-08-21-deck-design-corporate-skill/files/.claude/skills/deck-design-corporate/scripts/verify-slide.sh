#!/usr/bin/env bash
# verify-slide.sh <slide-file>
#
# Prints a self-contained JS expression that, when run inside the slide
# page (via `preview_eval` from Claude Preview MCP), returns a JSON
# pass/fail report for six canonical rect checks + asset 404s.
#
# The agent's workflow:
#   1. Start `python3 -m http.server 4180` from the repo root.
#   2. Run `scripts/verify-slide.sh tmp/decks/<deck>/slide-NN-<slug>.html`.
#   3. Pass the printed JS expression to `preview_eval`, targeting
#      http://localhost:4180/<slide-path>.
#   4. Read the returned JSON; if `passed: false`, fix and retry.
#
# Console-error capture is best-effort because preview_eval runs after
# initial page load; the expression checks console-recorded errors via a
# pre-installed sink if present, otherwise returns an empty list and
# flags it as `console_capture: "not-instrumented"`.
#
# Exit codes:
#   0  printed the snippet
#   1  bad arguments / file not found

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "verify-slide: usage: scripts/verify-slide.sh <slide-file>" >&2
  exit 1
fi

slide_file="$1"
if [ ! -f "$slide_file" ]; then
  echo "verify-slide: file not found: $slide_file" >&2
  exit 1
fi

# Make the path absolute for the JSON report.
abs="$(cd "$(dirname "$slide_file")" && pwd)/$(basename "$slide_file")"
# Escape for a JS string literal (backslash + double-quote). Newlines
# can't appear in a filesystem path component on macOS / Linux for our
# purposes, so we don't handle them.
abs_js="$(printf '%s' "$abs" | sed 's/\\/\\\\/g; s/"/\\"/g')"

# Emit the check JS for preview_eval. The check logic is the SINGLE SOURCE OF
# TRUTH in scripts/lib/slide-checks.js (also used headless by
# verify-deck-headless.py), so the two paths never drift. We cat that file
# (it defines window.__runSlideChecks) then append a call that returns the
# report for THIS slide. Paste the whole output into preview_eval.
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
checks_js="$script_dir/lib/slide-checks.js"
if [ ! -f "$checks_js" ]; then
  echo "verify-slide: missing $checks_js (shared check logic)" >&2
  exit 1
fi
cat "$checks_js"
printf '\n__runSlideChecks("%s");\n' "$abs_js"
