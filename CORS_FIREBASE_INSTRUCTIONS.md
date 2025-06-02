# Como Resolver o Problema de CORS no Firebase Storage

## Problema
O erro `Access to XMLHttpRequest blocked by CORS policy` indica que o Firebase Storage não está configurado para aceitar requisições do seu domínio Replit.

## Soluções (Escolha uma)

### Opção 1: Usar Firebase CLI (Recomendado)

1. **Instalar Firebase CLI localmente** (no seu computador):
   ```bash
   npm install -g firebase-tools
   ```

2. **Fazer login no Firebase**:
   ```bash
   firebase login
   ```

3. **Configurar CORS usando o arquivo cors.json**:
   ```bash
   firebase deploy --only storage
   ```
   
   Ou usando diretamente:
   ```bash
   gsutil cors set cors.json gs://aqua-vista.appspot.com
   ```

### Opção 2: Google Cloud Console (Mais Fácil)

1. **Acesse o Google Cloud Console**: https://console.cloud.google.com/
2. **Selecione o projeto**: aqua-vista
3. **Vá para Cloud Storage**: Menu → Cloud Storage → Buckets
4. **Encontre o bucket**: aqua-vista.appspot.com
5. **Configure CORS**:
   - Clique no bucket
   - Vá para a aba "Permissions"
   - Clique em "Edit CORS configuration"
   - Cole o conteúdo do arquivo `cors.json`

### Opção 3: Cloud Shell (No navegador)

1. **Acesse o Firebase Console**: https://console.firebase.google.com/
2. **Selecione o projeto**: aqua-vista
3. **Abra o Cloud Shell**: Ícone no canto superior direito
4. **Execute os comandos**:
   ```bash
   # Fazer upload do arquivo cors.json
   cat > cors.json << EOF
   [
     {
       "origin": ["*"],
       "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
       "maxAgeSeconds": 3600,
       "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "x-goog-resumable"]
     }
   ]
   EOF
   
   # Aplicar a configuração
   gsutil cors set cors.json gs://aqua-vista.appspot.com
   ```

### Opção 4: Regras de Storage (Alternativa)

Se as opções acima não funcionarem, verifique as regras de Storage:

1. **Firebase Console** → **Storage** → **Rules**
2. **Atualize as regras**:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true; // ATENÇÃO: Apenas para desenvolvimento
       }
     }
   }
   ```

## Verificar se a Configuração Funcionou

Após aplicar a configuração CORS:

1. **Aguarde alguns minutos** (pode demorar para propagar)
2. **Teste o upload** novamente na interface
3. **Verifique o console** do navegador para confirmar que não há mais erros de CORS

## Configuração CORS Explicada

O arquivo `cors.json` configurado permite:
- **origin: ["*"]**: Aceita requisições de qualquer domínio (inclui Replit)
- **method**: Métodos HTTP permitidos
- **maxAgeSeconds**: Cache da configuração CORS
- **responseHeader**: Headers necessários para uploads resumáveis

## Configuração mais Restritiva (Produção)

Para produção, use uma configuração mais restritiva:

```json
[
  {
    "origin": [
      "https://seu-dominio-de-producao.com",
      "https://*.replit.dev",
      "http://localhost:3000"
    ],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "x-goog-resumable"]
  }
]
```

## Se Nada Funcionar

Como último recurso, você pode:

1. **Usar outro provedor de storage** (AWS S3, Cloudinary, etc.)
2. **Implementar upload via API route** (Next.js API routes como proxy)
3. **Contatar o suporte do Firebase**

## Status Atual

- ✅ Arquivo `cors.json` criado
- ✅ Tratamento de erro melhorado
- ❌ CORS ainda não aplicado ao bucket
- ⏳ Aguardando configuração manual via Firebase/Google Cloud Console 