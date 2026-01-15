# Script para deploy inmediato a producción
$ErrorActionPreference = "Continue"

# Guardar branch actual
$currentBranch = git branch --show-current 2>&1 | Out-String
$currentBranch = $currentBranch.Trim()

Write-Output "Branch actual: $currentBranch" | Tee-Object -FilePath "deploy-log.txt" -Append

# Agregar todos los cambios
Write-Output "Agregando cambios..." | Tee-Object -FilePath "deploy-log.txt" -Append
git add -A 2>&1 | Tee-Object -FilePath "deploy-log.txt" -Append

# Verificar si hay cambios para commitear
$status = git status --porcelain 2>&1 | Out-String
if ($status.Trim() -ne "") {
    Write-Output "Haciendo commit..." | Tee-Object -FilePath "deploy-log.txt" -Append
    git commit -m "Update: cambios para producción" 2>&1 | Tee-Object -FilePath "deploy-log.txt" -Append
}

# Cambiar a main
Write-Output "Cambiando a main..." | Tee-Object -FilePath "deploy-log.txt" -Append
git checkout main 2>&1 | Tee-Object -FilePath "deploy-log.txt" -Append

if ($LASTEXITCODE -eq 0) {
    # Si hay una branch anterior diferente a main, hacer merge
    if ($currentBranch -and $currentBranch -ne "main") {
        Write-Output "Fusionando $currentBranch a main..." | Tee-Object -FilePath "deploy-log.txt" -Append
        git merge $currentBranch --no-ff -m "Merge $currentBranch to main - Deploy a producción" 2>&1 | Tee-Object -FilePath "deploy-log.txt" -Append
    }

    # Push a producción
    Write-Output "Haciendo push a producción..." | Tee-Object -FilePath "deploy-log.txt" -Append
    git push origin main 2>&1 | Tee-Object -FilePath "deploy-log.txt" -Append

    if ($LASTEXITCODE -eq 0) {
        Write-Output "✓ Deploy completado exitosamente!" | Tee-Object -FilePath "deploy-log.txt" -Append
    } else {
        Write-Output "ERROR en push" | Tee-Object -FilePath "deploy-log.txt" -Append
    }
} else {
    Write-Output "ERROR: No se pudo cambiar a main" | Tee-Object -FilePath "deploy-log.txt" -Append
}

Write-Output "Ver deploy-log.txt para más detalles"
