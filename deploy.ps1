# ============================================
# ETERNALYS - Script de Commit, Build & Deploy
# Par Antoine Eymard
# ============================================

param(
    [ValidateSet("major", "minor", "patch")]
    [string]$VersionBump = "patch",
    [switch]$SkipBuild = $false
)

# Configuration - Utilise les variables d'environnement ou le fichier .env.local
$GITHUB_USERNAME = "peymard-actifit"
$REPO_NAME = "eternalys"
$VERCEL_PROJECT_NAME = "eternalys"

# Charger les tokens depuis les variables d'environnement ou fichier config
$GITHUB_TOKEN = $env:ETERNALYS_GITHUB_TOKEN
$VERCEL_TOKEN = $env:ETERNALYS_VERCEL_TOKEN

# Si pas de variables d'env, essayer de charger depuis .deploy.config
$configPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) ".deploy.config"
if ((-not $GITHUB_TOKEN -or -not $VERCEL_TOKEN) -and (Test-Path $configPath)) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    if (-not $GITHUB_TOKEN) { $GITHUB_TOKEN = $config.GITHUB_TOKEN }
    if (-not $VERCEL_TOKEN) { $VERCEL_TOKEN = $config.VERCEL_TOKEN }
}

# Couleurs pour l'affichage
function Write-Step { param($message) Write-Host "`n▶ $message" -ForegroundColor Cyan }
function Write-Success { param($message) Write-Host "✓ $message" -ForegroundColor Green }
function Write-Error { param($message) Write-Host "✗ $message" -ForegroundColor Red }
function Write-Info { param($message) Write-Host "  $message" -ForegroundColor Gray }
function Write-Version { param($message) Write-Host "📦 $message" -ForegroundColor Magenta }

# Bannière
Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║         ETERNALYS - Deploy Script          ║" -ForegroundColor Yellow
Write-Host "║      Commit, Build & Deploy Automatisé     ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Yellow

# Vérifier les tokens
if (-not $GITHUB_TOKEN -or -not $VERCEL_TOKEN) {
    Write-Error "Tokens non configurés!"
    Write-Info "Configurez les variables d'environnement:"
    Write-Info "  `$env:ETERNALYS_GITHUB_TOKEN = 'votre_token_github'"
    Write-Info "  `$env:ETERNALYS_VERCEL_TOKEN = 'votre_token_vercel'"
    Write-Info ""
    Write-Info "Ou créez un fichier .deploy.config avec:"
    Write-Info '  { "GITHUB_TOKEN": "xxx", "VERCEL_TOKEN": "xxx" }'
    exit 1
}

# Se placer dans le bon répertoire
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# ============================================
# ÉTAPE 0: Incrémentation de version
# ============================================
Write-Step "Gestion de la version ($VersionBump)..."

$packageJsonPath = Join-Path $scriptPath "package.json"
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

$currentVersion = $packageJson.version
$versionParts = $currentVersion -split '\.'
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1]
$patch = [int]$versionParts[2]

switch ($VersionBump) {
    "major" { 
        $major++
        $minor = 0
        $patch = 0
    }
    "minor" { 
        $minor++
        $patch = 0
    }
    "patch" { 
        $patch++
    }
}

$newVersion = "$major.$minor.$patch"
$packageJson.version = $newVersion

# Sauvegarder le package.json mis à jour
$packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath -Encoding UTF8

Write-Version "Version: $currentVersion → $newVersion"
Write-Success "package.json mis à jour"

# ============================================
# ÉTAPE 1: NPM Install
# ============================================
if (-not $SkipBuild) {
    Write-Step "Installation des dépendances (npm install)..."
    
    try {
        $npmOutput = npm install 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Dépendances installées"
        } else {
            Write-Info "npm install: code $LASTEXITCODE (Vercel fera l'install)"
        }
    } catch {
        Write-Info "npm non disponible - Vercel fera l'installation"
    }

    # ============================================
    # ÉTAPE 2: NPM Build
    # ============================================
    Write-Step "Build du projet (npm run build)..."
    
    try {
        $buildOutput = npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Build réussi"
        } else {
            Write-Info "Build local échoué - Vercel fera le build"
        }
    } catch {
        Write-Info "Build non disponible - Vercel fera le build"
    }
} else {
    Write-Info "Build ignoré (flag -SkipBuild)"
}

# ============================================
# ÉTAPE 3: Git Add & Commit
# ============================================
Write-Step "Git: Ajout et commit..."

$gitAvailable = $false
try {
    git add . 2>$null
    if ($LASTEXITCODE -eq 0) {
        $gitAvailable = $true
        Write-Success "Fichiers ajoutés"
    }
} catch { }

if ($gitAvailable) {
    $defaultMessage = "v$newVersion - Update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    $commitMessage = Read-Host "Message de commit (Entrée pour: '$defaultMessage')"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = $defaultMessage
    }

    git commit -m $commitMessage 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Commit créé"
    }

    # Tag
    git tag -a "v$newVersion" -m "Version $newVersion" 2>$null
    
    # Push
    Write-Step "Push vers GitHub..."
    $remoteUrl = "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    git remote set-url origin $remoteUrl 2>$null
    git push -u origin main 2>$null
    git push --tags 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Code poussé sur GitHub"
    }
} else {
    # Fallback API
    Write-Info "Git non disponible, push via API GitHub..."
    
    $headers = @{
        "Authorization" = "token $GITHUB_TOKEN"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    try {
        $currentFile = Invoke-RestMethod -Uri "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME/contents/package.json" -Headers $headers
        $content = Get-Content $packageJsonPath -Raw -Encoding UTF8
        $base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))
        
        $body = @{
            message = "v$newVersion - Update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
            content = $base64
            sha = $currentFile.sha
            branch = "main"
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME/contents/package.json" -Headers $headers -Method Put -Body $body | Out-Null
        Write-Success "package.json poussé via API"
    } catch {
        Write-Error "Erreur API: $($_.Exception.Message)"
    }
}

# ============================================
# ÉTAPE 4: Vérification Vercel
# ============================================
Write-Step "Vérification Vercel..."

$vHeaders = @{
    "Authorization" = "Bearer $VERCEL_TOKEN"
    "Content-Type" = "application/json"
}

try {
    $projectInfo = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$VERCEL_PROJECT_NAME" -Headers $vHeaders
    Write-Success "Projet Vercel: $($projectInfo.name)"
    Write-Info "Vercel va déployer automatiquement"
    Write-Info "URL: https://$VERCEL_PROJECT_NAME.vercel.app"
} catch {
    Write-Error "Erreur Vercel: $($_.Exception.Message)"
}

# ============================================
# RÉSUMÉ FINAL
# ============================================
Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║       DÉPLOIEMENT v$newVersion TERMINÉ        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Info "Version  : $newVersion"
Write-Info "GitHub   : https://github.com/$GITHUB_USERNAME/$REPO_NAME"
Write-Info "Vercel   : https://$VERCEL_PROJECT_NAME.vercel.app"
Write-Info "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

return $newVersion
