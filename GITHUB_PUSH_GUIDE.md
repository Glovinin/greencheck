# 🚀 Guia para Push do GreenCheck no GitHub

## ✅ Status Atual

- ✅ Repositório Git inicializado
- ✅ README.md completo criado
- ✅ LICENSE criada (MIT com aviso de patente)
- ✅ .gitignore configurado
- ✅ Commit criado com todo o projeto
- ✅ Remote configurado: `https://github.com/Glovinin/greencheck.git`

## 🔐 Método 1: Personal Access Token (RECOMENDADO)

### Passo 1: Criar o Token

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Configure:
   - **Note**: "GreenCheck Deploy"
   - **Expiration**: 90 days (ou o que preferir)
   - **Scopes**: Marque estas opções:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
4. Clique em **"Generate token"**
5. **⚠️ COPIE O TOKEN AGORA** (você não verá ele novamente!)

### Passo 2: Fazer o Push

Abra o terminal e execute:

```bash
cd /home/runner/workspace
git push -u origin main --force
```

Quando solicitado:
- **Username**: `Glovinin` (seu username do GitHub)
- **Password**: Cole o TOKEN que você copiou (não sua senha normal!)

### Passo 3: Verificar

Acesse: https://github.com/Glovinin/greencheck

---

## 🔑 Método 2: SSH (Se você já tem configurado)

### Verificar se tem SSH configurado:

```bash
cat ~/.ssh/id_rsa.pub
```

Se retornar uma chave, você tem SSH configurado!

### Mudar para SSH:

```bash
cd /home/runner/workspace
git remote set-url origin git@github.com:Glovinin/greencheck.git
git push -u origin main --force
```

---

## 🖥️ Método 3: GitHub CLI (Se disponível)

```bash
# Instalar GitHub CLI (se não tiver)
# No Replit, pode não estar disponível

# Autenticar
gh auth login

# Fazer push
git push -u origin main --force
```

---

## 🐚 Método 4: Script Automático

Execute o script que criei:

```bash
cd /home/runner/workspace
./push-to-github.sh
```

---

## 📋 Comandos Úteis

### Ver status do repositório:
```bash
git status
```

### Ver commits:
```bash
git log --oneline -5
```

### Ver remote configurado:
```bash
git remote -v
```

### Refazer o commit (se necessário):
```bash
git add -A
git commit --amend -m "Nova mensagem"
```

---

## ❓ Troubleshooting

### Erro: "Authentication failed"
- ✅ Certifique-se de usar o TOKEN como senha, não sua senha do GitHub
- ✅ Verifique se o token tem as permissões corretas (`repo`, `workflow`)

### Erro: "Repository not found"
- ✅ Verifique se o repositório existe: https://github.com/Glovinin/greencheck
- ✅ Verifique se você tem permissão de escrita no repositório

### Erro: "Permission denied (publickey)"
- ✅ Use o método 1 (Personal Access Token) em vez de SSH

### Erro: "Updates were rejected"
- ✅ Use `--force` para forçar o push (já incluído nos comandos acima)

---

## 🎯 Depois do Push

Após o push bem-sucedido, você terá:

1. ✅ Código completo no GitHub
2. ✅ README.md profissional visível
3. ✅ Licença MIT com aviso de patente
4. ✅ Estrutura organizada do projeto

### Próximos passos recomendados:

1. **Adicionar Topics ao repositório**
   - Vá em: https://github.com/Glovinin/greencheck
   - Clique em ⚙️ (Settings) → "Manage topics"
   - Adicione: `esg`, `blockchain`, `ai`, `sustainability`, `nextjs`, `typescript`

2. **Configurar GitHub Pages (opcional)**
   - Settings → Pages
   - Source: Deploy from branch `main`

3. **Criar Release**
   - Releases → Create a new release
   - Tag: `v1.0.0`
   - Title: "🌱 GreenCheck v1.0.0 - Initial Release"

4. **Adicionar Social Preview**
   - Settings → General → Social preview
   - Upload: `/public/socialbanner.jpg`

---

## 📞 Precisa de Ajuda?

Se tiver problemas:
1. Verifique se seguiu todos os passos
2. Tente o Método 1 (Personal Access Token)
3. Certifique-se de que o repositório https://github.com/Glovinin/greencheck existe

---

**Feito com 💚 pelo GreenCheck Team**

