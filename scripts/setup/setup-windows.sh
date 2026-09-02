#!/usr/bin/env bash
# ADLC Discovery Tool — machine setup (Windows, via Git Bash)
# Run from the repo root after cloning: bash scripts/setup/setup-windows.sh
#
# Claude/Codex Desktop's shell tool on Windows runs through Git Bash (bundled
# with Git for Windows), not PowerShell directly — this is the bash entry
# point it invokes. The actual install logic lives in setup-windows.ps1;
# this just hands off to it with the path translated for powershell.exe.
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
win_script="$(cygpath -w "$script_dir/setup-windows.ps1" 2>/dev/null || echo "$script_dir/setup-windows.ps1")"

exec powershell.exe -ExecutionPolicy Bypass -File "$win_script"