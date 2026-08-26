# ADLC Discovery Tool - machine setup (Windows)
# Run from the repo root after cloning:
#   powershell -ExecutionPolicy Bypass -File scripts/setup/setup-windows.ps1
$ErrorActionPreference = "Stop"

function Confirm-Action {
    param([string]$Message)
    $reply = Read-Host "$Message [y/N]"
    return $reply -match '^(?i:y|yes)$'
}

function Test-IsAdmin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Install-Git {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        if (Get-Command winget -ErrorAction SilentlyContinue) {
            Write-Host "git not found - installing via winget..."
            winget install -e --id Git.Git
            Write-Host ""
            Write-Host "Close and reopen this terminal, then re-run this script."
            exit 0
        } else {
            Write-Host "git not found and winget isn't available."
            Write-Host "Install it manually: https://git-scm.com/downloads/win"
            exit 1
        }
    } else {
        Write-Host "git: $(git --version)"
    }
}

function Install-Node {
    if (-not (Get-Command nvm -ErrorAction SilentlyContinue)) {
        if (Get-Command winget -ErrorAction SilentlyContinue) {
            Write-Host "nvm-windows not found - installing via winget..."
            winget install -e --id CoreyButler.NVMforWindows
            Write-Host ""
            Write-Host "Close and reopen this terminal, then re-run this script."
            exit 0
        } else {
            Write-Host "nvm not found and winget isn't available."
            Write-Host "Install nvm-windows manually: https://github.com/coreybutler/nvm-windows"
            exit 1
        }
    } else {
        Write-Host "nvm: $(nvm -v)"
    }

    $nodeVersion = (Get-Content ".nvmrc").Trim()
    Write-Host "Installing/selecting Node $nodeVersion via nvm..."
    nvm install $nodeVersion
    nvm use $nodeVersion

    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host ""
        Write-Host "node is still not on PATH after 'nvm use' - nvm-windows likely failed to create its symlink."
        Write-Host "Re-run this script from an elevated PowerShell (Run as Administrator) and try again."
        exit 1
    }
    Write-Host "node: $(node --version)"
}

function Install-Yarn {
    corepack enable
    Write-Host "yarn: $(yarn --version)"
}

function Install-GitHubCli {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
            Write-Host "gh not found and winget isn't available."
            Write-Host "Install it manually: https://cli.github.com"
            return
        }
        if (Confirm-Action "Install GitHub CLI (gh)?") {
            Write-Host "Installing GitHub CLI via winget..."
            winget install -e --id GitHub.cli
        } else {
            Write-Host "Skipping gh install - install it later: https://cli.github.com"
            return
        }
    } else {
        Write-Host "gh: $((gh --version) | Select-Object -First 1)"
    }

    gh auth status 2>$null
    if ($LASTEXITCODE -ne 0) {
        if (Confirm-Action "Run 'gh auth login' now?") {
            gh auth login
        } else {
            Write-Host "Skipping gh auth login - run it yourself before creating PRs: gh auth login"
        }
    }
}

function Install-Dependencies {
    Write-Host "Installing workspace dependencies (yarn install --immutable)..."
    yarn install --immutable
}

function Show-NextSteps {
    Write-Host ""
    Write-Host "Setup complete."
    Write-Host "Next steps:"
    Write-Host "  1. If prompted above, run: gh auth login"
    Write-Host "  2. Open Claude Desktop and add this folder as a project"
}

function Main {
    Write-Host "== ADLC Discovery Tool - machine setup (Windows) =="
    Write-Host ""

    if (-not (Test-IsAdmin)) {
        Write-Host "WARNING: this terminal isn't running as Administrator."
        Write-Host "nvm-windows needs elevation to create the symlink for the active Node version."
        Write-Host "If Node setup fails below, close this terminal and re-run as Administrator."
        Write-Host ""
    }

    Install-Git
    Install-Node
    Install-Yarn
    Install-GitHubCli
    Install-Dependencies
    Show-NextSteps
}

Main