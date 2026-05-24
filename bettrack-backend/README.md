# BetTrack API — Deploy no Vercel

## Pré-requisitos
- Conta gratuita no vercel.com
- Chave da API Anthropic (console.anthropic.com)

## Deploy (3 passos)

### Opção A — Via GitHub (recomendado)
1. Crie um repositório no GitHub e faça push desta pasta
2. No Vercel: "Add New Project" → importe o repositório
3. Adicione a env var: ANTHROPIC_API_KEY = sua-chave
4. Clique Deploy

### Opção B — Via Vercel CLI
```bash
npm i -g vercel
cd bettrack-backend
vercel --prod
# Quando pedir, adicione ANTHROPIC_API_KEY
```

## Após o deploy
Sua URL será: https://bettrack-api-xxx.vercel.app

Cole no app BetTrack → aba Importar → campo URL do Backend

## Teste o endpoint
GET  https://sua-url.vercel.app/api/health
POST https://sua-url.vercel.app/api/analyze
