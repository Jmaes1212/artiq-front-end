<# 
    Launches the Artiq site in one step.
    - Installs dependencies (only if node_modules missing)
    - Starts the server via `npm start`
#>

param(
    [switch]$ForceInstall
)

$ErrorActionPreference = 'Stop'

Push-Location -Path "$PSScriptRoot\server"

try {
    $needsInstall = $ForceInstall.IsPresent -or -not (Test-Path -Path '.\node_modules')

    if ($needsInstall) {
        Write-Host 'Installing npm dependencies…' -ForegroundColor Cyan
        npm install
    }

    Write-Host 'Starting Artiq server on http://localhost:4000 …' -ForegroundColor Cyan
    npm start
}
finally {
    Pop-Location
}
