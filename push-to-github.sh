#!/bin/bash

echo "🌱 GreenCheck - Push to GitHub Script"
echo "======================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Verificando status do repositório...${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Erro: Não estamos em um repositório Git!${NC}"
    exit 1
fi

# Mostrar remote
echo -e "${GREEN}🔗 Remote configurado:${NC}"
git remote -v
echo ""

# Mostrar último commit
echo -e "${GREEN}📝 Último commit:${NC}"
git log --oneline -1
echo ""

# Verificar branch
BRANCH=$(git branch --show-current)
echo -e "${GREEN}🌿 Branch atual: ${BRANCH}${NC}"
echo ""

echo -e "${YELLOW}⚠️  ATENÇÃO: Este comando fará um FORCE PUSH para o GitHub!${NC}"
echo -e "${YELLOW}⚠️  Isso substituirá completamente o histórico no repositório remoto.${NC}"
echo ""

# Instruções
echo -e "${BLUE}📋 Para fazer o push, você precisa:${NC}"
echo ""
echo "1. Ter um Personal Access Token do GitHub"
echo "   Crie em: https://github.com/settings/tokens"
echo "   Selecione os escopos: 'repo', 'workflow'"
echo ""
echo "2. Execute este comando:"
echo -e "   ${GREEN}git push -u origin main --force${NC}"
echo ""
echo "3. Quando solicitado:"
echo "   - Username: seu username do GitHub"
echo "   - Password: cole o TOKEN (não sua senha)"
echo ""

read -p "Deseja executar o push agora? (s/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${BLUE}🚀 Executando push...${NC}"
    echo ""
    
    # Tentar fazer o push
    git push -u origin main --force
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
        echo ""
        echo -e "${GREEN}🎉 Seu projeto GreenCheck está agora no GitHub:${NC}"
        echo -e "   ${BLUE}https://github.com/Glovinin/greencheck${NC}"
        echo ""
    else
        echo ""
        echo -e "${RED}❌ Erro ao fazer push!${NC}"
        echo ""
        echo -e "${YELLOW}💡 Dica: Certifique-se de:${NC}"
        echo "   1. Estar usando um Personal Access Token (não a senha)"
        echo "   2. O token ter permissões 'repo' e 'workflow'"
        echo "   3. O repositório https://github.com/Glovinin/greencheck existir"
        echo ""
    fi
else
    echo ""
    echo -e "${YELLOW}❌ Push cancelado pelo usuário.${NC}"
    echo ""
    echo "Para fazer o push manualmente depois, execute:"
    echo -e "   ${GREEN}git push -u origin main --force${NC}"
    echo ""
fi

echo -e "${BLUE}======================================"
echo -e "Script finalizado!${NC}"

