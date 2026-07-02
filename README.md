# CaseCellShop — Desafio Técnico Pleno

Monorepo com backend Node.js e frontend React para fluxo de checkout de capinhas.

## Estrutura

```
CaseCellShop/
├── Backend/     # API Node.js + MongoDB + Redis + BullMQ
├── Frontend/    # React (Vite)
├── Desafio_Parte_1A.MD
├── Desafio_Parte_1B.MD
└── prompts.MD
```

## Como rodar

### 1. Backend

```bash
cd Backend
cp .env.example .env
npm install
npm run docker:up
npm run seed
npm run dev
```

API: `http://localhost:3001`

### 2. Frontend

```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

## Documentação

- [Backend/README.md](Backend/README.md)
- [Frontend/README.md](Frontend/README.md)
