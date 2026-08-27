#!/bin/bash
# Install editable pptx — DataArt deck-design
#
# What this does: installs on your Mac the toolchain needed to
# generate editable-text pptx from Claude Cowork:
#   • python-pptx   ~5 MB    — assembles the .pptx file
#   • Pillow        ~5 MB    — image handling
#   • playwright    ~5 MB    — drives the headless browser
#   • Chromium      ~150 MB  — the browser (required for editable pptx)
# Everything installs into your user-site Python (no sudo, no
# elevated privileges).
#
# Why: after this, Cowork can produce pptx with EDITABLE text
# (not text baked into PNG images). The Cowork sandbox blocks
# `pip install` from inside the session, but your normal
# Terminal can reach PyPI without restrictions — so we run the
# install from here instead.
#
# How to run: double-click in Finder. A Terminal window will
# open, install will run (~3-5 minutes mostly downloading
# Chromium), press Enter at the end to close.

set -o pipefail
cd "$HOME"

# Self-remove macOS Gatekeeper quarantine so re-runs do not
# prompt with "open from unknown developer?". Errors are
# swallowed — the attribute may not be set if Cowork's bash
# stripped it before write.
xattr -d com.apple.quarantine "$0" 2>/dev/null || true

# Pretty header
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "    DataArt deck-design — install editable pptx"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  This installs the toolchain needed by Cowork to generate"
echo "  pptx with editable text."
echo ""
echo "  Will be installed (~170 MB total):"
echo "    • python-pptx + Pillow      — pptx assembler"
echo "    • playwright + Chromium     — slide renderer"
echo ""
echo "  Install takes ~3-5 minutes (Chromium downloads from the net)."
echo "  One-time. No sudo — writes only to your user directory."
echo ""
echo "  When done, close this window and return to Claude Cowork."
echo "  The next deck will have editable text pptx."
echo ""

# Auto-confirm path: if the Cowork agent (via chat AskUserQuestion)
# already got user consent, it places a sentinel file before
# triggering this script. We detect that and skip the y/N prompt
# so the user sees only progress, no extra interactions.
AUTO_SENTINEL="$HOME/Desktop/.deck-design-auto-confirm"
if [ -f "$AUTO_SENTINEL" ]; then
  echo "  ✓ Confirmed via Cowork chat. Installing…"
  rm -f "$AUTO_SENTINEL"
else
  read -p "  Install now? [y/N] " yn
  case "${yn}" in
    [Yy]|[Yy][Ee][Ss]) ;;
    *)
      echo ""
      echo "  Cancelled. You can close this window (Cmd+W)."
      exit 0
      ;;
  esac
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Step 1/4: searching for Python 3 on your Mac…"
echo "═══════════════════════════════════════════════════════════"
PY=""
for cand in \
  /opt/homebrew/bin/python3.13 /opt/homebrew/bin/python3.12 \
  /opt/homebrew/bin/python3.11 /opt/homebrew/bin/python3 \
  /usr/local/bin/python3.13 /usr/local/bin/python3.12 \
  /usr/local/bin/python3.11 /usr/local/bin/python3 \
  python3.13 python3.12 python3.11 python3 \
  /usr/bin/python3; do
  if command -v "$cand" >/dev/null 2>&1 && "$cand" --version >/dev/null 2>&1; then
    PY=$(command -v "$cand")
    break
  fi
done

if [ -z "$PY" ]; then
  echo ""
  echo "  ✗ Python 3 not found."
  echo ""
  echo "  Get the official installer: https://www.python.org/downloads/macos/"
  echo "  After installing, run this file again."
  echo ""
  read -p "  Press Enter to close…"
  exit 1
fi

PY_VER=$("$PY" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "  ✓ Found: $PY  (Python $PY_VER)"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Step 2/4: installing python-pptx + Pillow + playwright"
echo "═══════════════════════════════════════════════════════════"

# Helper: try --user install, fall back to --break-system-packages
# (PEP 668 on macOS Sonoma+).
pip_install() {
  local pkg="$1"
  if "$PY" -c "import ${pkg//-/_}" 2>/dev/null; then
    echo "  ✓ $pkg already installed"
    return 0
  fi
  echo "  → installing $pkg…"
  if "$PY" -m pip install --quiet --user "$pkg" 2>/dev/null \
   || "$PY" -m pip install --quiet --user --break-system-packages "$pkg" 2>/dev/null; then
    echo "  ✓ $pkg installed"
    return 0
  fi
  return 1
}

INSTALL_ERRORS=0
pip_install "python-pptx"  || INSTALL_ERRORS=$((INSTALL_ERRORS+1))
pip_install "Pillow"       || INSTALL_ERRORS=$((INSTALL_ERRORS+1))
pip_install "playwright"   || INSTALL_ERRORS=$((INSTALL_ERRORS+1))

if [ "$INSTALL_ERRORS" -gt 0 ]; then
  echo ""
  echo "  ✗ Not all packages installed. Possible reasons:"
  echo ""
  echo "    • No internet — check your wifi."
  echo "    • Corporate proxy blocks PyPI — contact IT."
  echo "    • Python is broken — reinstall from"
  echo "      https://www.python.org/downloads/macos/"
  echo ""
  echo "  To try manually:"
  echo "    $PY -m pip install --user python-pptx Pillow playwright"
  echo ""
  read -p "  Press Enter to close…"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Step 3/4: downloading Chromium (~150 MB, 2-4 minutes)"
echo "═══════════════════════════════════════════════════════════"

# Check if chromium already downloaded
if "$PY" -m playwright --version >/dev/null 2>&1; then
  if "$PY" -c "
import sys
try:
  from playwright.sync_api import sync_playwright
  with sync_playwright() as p:
    path = p.chromium.executable_path
    import os
    sys.exit(0 if os.path.exists(path) else 1)
except Exception:
  sys.exit(1)
" 2>/dev/null; then
    echo "  ✓ Chromium already downloaded"
  else
    echo "  → downloading Chromium (this may take several minutes)…"
    "$PY" -m playwright install chromium
    DL_EXIT=$?
    if [ $DL_EXIT -eq 0 ]; then
      echo "  ✓ Chromium downloaded"
    else
      echo ""
      echo "  ✗ Chromium download failed (exit $DL_EXIT)."
      echo "  This is critical — without the browser, editable pptx is impossible."
      echo "  Check your internet connection and try manually:"
      echo "    $PY -m playwright install chromium"
      echo ""
      read -p "  Press Enter to close…"
      exit 1
    fi
  fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Step 4/4: verification"
echo "═══════════════════════════════════════════════════════════"

if "$PY" -c "
import pptx, PIL, playwright
print(f'  python-pptx {pptx.__version__}')
print(f'  Pillow     {PIL.__version__}')
print(f'  playwright {playwright.__version__}')
" 2>&1; then
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo "  ✓ Done! Return to Claude Cowork."
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo "  The next deck in Cowork will have EDITABLE text pptx."
  echo ""
  echo "  (You can delete install-editable-pptx.command now —"
  echo "   it is no longer needed.)"
  echo ""
else
  echo ""
  echo "  ⚠  Something installed but cannot be imported."
  echo "  May need a reboot or manual fix. Contact IT."
  echo ""
fi

read -p "  Press Enter to close…"
