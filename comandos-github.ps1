# Script para enviar o projeto Aqua Vista para o GitHub
# Execute este script no PowerShell

# Configurar o usuário e email do Git (caso ainda não esteja configurado)
# git config --global user.name "Seu Nome"
# git config --global user.email "seu.email@exemplo.com"

# Verificar status atual
Write-Host "Status atual do repositório:" -ForegroundColor Green
git status

# Verificar remotes configurados
Write-Host "`nRemotes configurados:" -ForegroundColor Green
git remote -v

# Se não houver um remote chamado origin, adicione-o
# Descomente e ajuste a linha abaixo inserindo seu nome de usuário do GitHub
# git remote add origin https://github.com/SEU_USUARIO/aqua-vista-monchique.git

# Certificar-se de que estamos no branch main
git branch -M main

# Adicionar todos os arquivos não rastreados (caso haja)
git add .

# Criar um commit (se houver alterações)
git commit -m "Atualização do projeto Aqua Vista Monchique"

# Enviar para o GitHub
Write-Host "`nEnviando para o GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "`nConcluído!" -ForegroundColor Green
Write-Host "Verifique seu repositório no GitHub para confirmar que os arquivos foram enviados." 