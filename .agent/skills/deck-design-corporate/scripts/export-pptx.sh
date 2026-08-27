#!/usr/bin/env bash
# export-pptx.sh
#
# Thin wrapper around export-pptx.py. Validates the deck directory,
# checks Python + python-pptx + playwright + chromium browser presence,
# and prints exact install commands when something is missing.
#
# Usage:
#   scripts/export-pptx.sh <deck-dir>
#
# Exit codes:
#   0  success
#   1  missing dependency (message points at fix)
#   2  bad arguments
#   3  no slide HTML files in deck-dir
#   ≥4 propagated from export-pptx.py

set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage: export-pptx.sh <deck-dir>

  <deck-dir>   Directory containing slide-NN-<slug>.html files. Typically
               tmp/decks/<deck-name>/.

The script writes <deck-dir>/<deck-name>.pptx (overwrites if present).
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 2
fi

deck_dir="$1"
if [[ ! -d "$deck_dir" ]]; then
  echo "export-pptx.sh: $deck_dir is not a directory" >&2
  exit 2
fi

# --- Resolve script + python path ------------------------------------------
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python_script="$script_dir/export-pptx.py"
if [[ ! -f "$python_script" ]]; then
  echo "export-pptx.sh: cannot locate export-pptx.py next to wrapper" >&2
  exit 1
fi

# --- Dependency probe ------------------------------------------------------
if ! command -v python3 >/dev/null 2>&1; then
  cat >&2 <<'EOF'
export-pptx.sh: python3 not found.
Install Python 3.10+ from https://www.python.org/downloads/ or via Homebrew:
  brew install python@3.11
EOF
  exit 1
fi

# Probe imports inside a single subprocess to avoid three separate spawns.
if ! python3 - <<'PY' >/dev/null 2>&1
import importlib
for m in ("pptx", "PIL", "playwright.sync_api"):
    importlib.import_module(m)
PY
then
  cat >&2 <<'EOF'
export-pptx.sh: missing Python deps (python-pptx, pillow, playwright).
Install with:
  pip3 install python-pptx pillow playwright
  playwright install chromium
EOF
  exit 1
fi

# Check chromium binary specifically — `pip install playwright` does not
# pull the browser binary; that needs `playwright install chromium`.
if ! python3 - <<'PY' >/dev/null 2>&1
from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
    # Touch executable_path to fail fast if chromium is not installed.
    path = p.chromium.executable_path
    if not path or not os.path.exists(path):
        raise SystemExit(1)
PY
then
  cat >&2 <<'EOF'
export-pptx.sh: Playwright is installed but the Chromium browser binary
is missing. Install it with:
  playwright install chromium
EOF
  exit 1
fi

# --- Sanity: deck-dir contains at least one slide HTML ----------------------
if ! ls "$deck_dir"/slide-[0-9][0-9]-*.html >/dev/null 2>&1; then
  echo "export-pptx.sh: no slide-NN-*.html files in $deck_dir" >&2
  exit 3
fi

# --- Run the Python exporter -----------------------------------------------
# Note: "$@" already contains $deck_dir as $1 — do not pass deck_dir twice.
exec python3 "$python_script" "$@"
