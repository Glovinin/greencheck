# Script para reiniciar completamente o Next.js
Write-Host "Limpando cache e reiniciando o Next.js..." -ForegroundColor Green

# Parar qualquer instância do Next.js em execução
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" } | Stop-Process -Force

# Limpar diretórios de build e cache
if (Test-Path -Path ".next") {
    Write-Host "Removendo diretório .next..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
}

if (Test-Path -Path "node_modules/.cache") {
    Write-Host "Removendo cache do Node.js..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules/.cache"
}

# Instalar dependências novamente para garantir integridade
Write-Host "Verificando dependências..." -ForegroundColor Yellow
npm install

# Iniciar o servidor de desenvolvimento
Write-Host "Iniciando o servidor Next.js..." -ForegroundColor Green
npm run dev 