# ADLC Discovery Tool — machine setup (Windows)
# Run from the repo root after cloning:
#   powershell -ExecutionPolicy Bypass -File scripts/setup/setup-windows.ps1
$ErrorActionPreference = "Stop"

function Confirm-Action {
    param([string]$Message)
    $reply = Read-Host "$Message [y/N]"
    return $reply -match '^(?i:y|yes)$'
}

function Install-Git {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        if (Get-Command winget -ErrorAction SilentlyContinue) {
            Write-Host "git not found — installing via winget..."
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
            Write-Host "nvm-windows not found — installing via winget..."
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
            Write-Host "Skipping gh install — install it later: https://cli.github.com"
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
            Write-Host "Skipping gh auth login — run it yourself before creating PRs: gh auth login"
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
    Write-Host "== ADLC Discovery Tool — machine setup (Windows) =="
    Write-Host ""

    Install-Git
    Install-Node
    Install-Yarn
    Install-GitHubCli
    Install-Dependencies
    Show-NextSteps
}

Main