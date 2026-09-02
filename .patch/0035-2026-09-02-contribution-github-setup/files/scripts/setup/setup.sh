#!/usr/bin/env bash
# ADLC Discovery Tool — machine setup dispatcher
# Run from the repo root after cloning: bash scripts/setup/setup.sh
#
# Single, OS-agnostic entry point — detects the platform and hands off to
# the matching script, so callers (including Claude/Codex Desktop) never
# have to guess which one applies.
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$(uname -s)" in
  Darwin)
    exec bash "$script_dir/setup-mac.sh"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    exec bash "$script_dir/setup-windows.sh"
    ;;
  *)
    echo "Unsupported OS: $(uname -s)" >&2
    exit 1
    ;;
esac