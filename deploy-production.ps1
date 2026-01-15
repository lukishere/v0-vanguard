# Script para fusionar branch actual a main y deploy a producción
# Este script es seguro y verifica el estado antes de hacer cambios

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Deploy a Producción - Merge a Main" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en un repositorio git
$gitStatus = git rev-parse --git-dir 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No estás en un repositorio git válido" -ForegroundColor Red
    exit 1
}

# Obtener la branch actual
$currentBranch = git branch --show-current
Write-Host "Branch actual: $currentBranch" -ForegroundColor Yellow
Write-Host ""

# Verificar si hay cambios sin commitear
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "ADVERTENCIA: Hay cambios sin commitear:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $response = Read-Host "¿Deseas hacer commit de estos cambios antes de continuar? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host "Agregando cambios..."
        git add -A
        $commitMessage = Read-Host "Ingresa el mensaje de commit (o presiona Enter para usar mensaje por defecto)"
        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            $commitMessage = "Update: cambios para producción"
        }
        git commit -m $commitMessage
        Write-Host "✓ Cambios commiteados" -ForegroundColor Green
    } else {
        Write-Host "Saltando commit de cambios" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Verificar si existe la branch main
$mainExists = git show-ref --verify --quiet refs/heads/main
if (-not $mainExists) {
    Write-Host "La branch 'main' no existe. Verificando si existe 'master'..." -ForegroundColor Yellow
    $masterExists = git show-ref --verify --quiet refs/heads/master
    if ($masterExists) {
        Write-Host "Creando branch 'main' desde 'master'..." -ForegroundColor Yellow
        git checkout -b main master
    } else {
        Write-Host "Creando nueva branch 'main'..." -ForegroundColor Yellow
        git checkout -b main
    }
} else {
    Write-Host "Cambiando a branch 'main'..." -ForegroundColor Yellow
    git checkout main
    Write-Host "✓ Cambiado a main" -ForegroundColor Green

    # Actualizar main desde remoto si existe
    $remoteMainExists = git show-ref --verify --quiet refs/remotes/origin/main
    if ($remoteMainExists) {
        Write-Host "Actualizando main desde remoto..." -ForegroundColor Yellow
        git pull origin main
    }
}

Write-Host ""

# Si estamos en una branch diferente a main, fusionar
if ($currentBranch -ne "main" -and $currentBranch -ne "") {
    Write-Host "Fusionando '$currentBranch' a 'main'..." -ForegroundColor Yellow
    git merge $currentBranch --no-ff -m "Merge $currentBranch to main - Deploy a producción"
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Fallo en el merge. Puede haber conflictos." -ForegroundColor Red
        Write-Host "Por favor resuelve los conflictos manualmente:" -ForegroundColor Yellow
        Write-Host "  1. Resuelve los conflictos en los archivos marcados" -ForegroundColor Cyan
        Write-Host "  2. git add ." -ForegroundColor Cyan
        Write-Host "  3. git commit -m 'Resolve merge conflicts'" -ForegroundColor Cyan
        Write-Host "  4. Ejecuta este script nuevamente o: git push origin main" -ForegroundColor Cyan
        exit 1
    }
    Write-Host "✓ Merge completado" -ForegroundColor Green
} else {
    Write-Host "Ya estás en main. Continuando con push..." -ForegroundColor Yellow
}

Write-Host ""

# Verificar si hay un remoto configurado
$remoteUrl = git config --get remote.origin.url
if ($remoteUrl) {
    Write-Host "Remoto configurado: $remoteUrl" -ForegroundColor Cyan
    Write-Host ""

    # Hacer push a main
    Write-Host "Haciendo push a origin/main..." -ForegroundColor Yellow
    Write-Host "Esto trigger el deploy automático en Vercel (si está configurado)" -ForegroundColor Cyan
    Write-Host ""

    git push origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "✓ Deploy iniciado correctamente!" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "El deploy en Vercel debería iniciarse automáticamente." -ForegroundColor Cyan
        Write-Host "Puedes verificar el progreso en:" -ForegroundColor Cyan
        Write-Host "  https://vercel.com/dashboard" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "ERROR: El push falló" -ForegroundColor Red
        Write-Host "Verifica tu conexión y permisos de git" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "ADVERTENCIA: No hay remoto configurado" -ForegroundColor Yellow
    Write-Host "Los cambios están en local. Para hacer deploy:" -ForegroundColor Yellow
    Write-Host "  1. Configura un remoto: git remote add origin <url>" -ForegroundColor Cyan
    Write-Host "  2. Haz push: git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""
