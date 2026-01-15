# Script de deploy
Write-Host "Agregando cambios a git..."
git add -A

Write-Host "Estado de git:"
git status

Write-Host "Haciendo commit..."
git commit -m "Update: cambios en language-context y documentación"

Write-Host "Haciendo push..."
git push

Write-Host "Deploy completado. Vercel debería hacer deploy automático si está conectado al repositorio."
