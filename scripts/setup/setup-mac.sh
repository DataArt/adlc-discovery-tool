#!/usr/bin/env bash
# ADLC Discovery Tool — machine setup (macOS)
# Run from the repo root after cloning: bash scripts/setup/setup-mac.sh
set -euo pipefail

confirm() {
  local reply
  read -r -p "$1 [y/N] " reply
  case "$reply" in
    [yY]|[yY][eE][sS]) return 0 ;;
    *) return 1 ;;
  esac
}

ensure_brew() {
  if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew not found — installing..."
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"
  else
    echo "brew: $(brew --version | head -1)"
  fi
}

install_git() {
  if ! command -v git >/dev/null 2>&1; then
    ensure_brew
    echo "Installing git via Homebrew..."
    brew install git
  else
    echo "git: $(git --version)"
  fi
}

setup_node() {
  export NVM_DIR="$HOME/.nvm"
  if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    echo "nvm not found — installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    # shellcheck disable=SC1091
    source "$NVM_DIR/nvm.sh"
  else
    # shellcheck disable=SC1091
    source "$NVM_DIR/nvm.sh"
    echo "nvm: $(nvm --version)"
  fi

  echo "Installing/selecting Node (from .nvmrc) via nvm..."
  nvm install
  nvm use
  echo "node: $(node --version)"
}

setup_yarn() {
  corepack enable
  echo "yarn: $(yarn --version)"
}

setup_gh() {
  if ! command -v gh >/dev/null 2>&1; then
    if confirm "Install GitHub CLI (gh)?"; then
      ensure_brew
      echo "Installing GitHub CLI via Homebrew..."
      brew install gh
    else
      echo "Skipping gh install — install it later: https://cli.github.com"
      return
    fi
  else
    echo "gh: $(gh --version | head -1)"
  fi

  if ! gh auth status >/dev/null 2>&1; then
    if confirm "Run 'gh auth login' now?"; then
      gh auth login
    else
      echo "Skipping gh auth login — run it yourself before creating PRs: gh auth login"
    fi
  fi
}

install_dependencies() {
  echo "Installing workspace dependencies (yarn install --immutable)..."
  yarn install --immutable
}

print_next_steps() {
  echo ""
  echo "Setup complete."
  echo "Next steps:"
  echo "  1. If prompted above, run: gh auth login"
  echo "  2. Open Claude Desktop and add this folder as a project"
}

main() {
  echo "== ADLC Discovery Tool — machine setup (macOS) =="
  echo ""

  install_git
  setup_node
  setup_yarn
  setup_gh
  install_dependencies
  print_next_steps
}

main "$@"
