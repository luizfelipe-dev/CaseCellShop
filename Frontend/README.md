# CaseCellShop — Frontend

Interface React simples para vitrine e checkout de capinhas, consumindo a API do [Backend](../Backend/README.md).

## Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3001` (MongoDB + Redis via Docker)

## Instalação e execução

```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API | `http://localhost:3001` |

## Fluxo da aplicação

1. Lista produtos via `GET /products`
2. Usuário seleciona produto e informa quantidade
3. Checkout via `POST /checkout` com `uid` (UUID) para idempotência
4. Polling em `GET /orders/:uid` a cada 2s até `completed` ou `failed`

## Tratamento de erros

| errorCode | Comportamento na UI |
|-----------|---------------------|
| `user_request_error` | Alerta vermelho — dados inválidos |
| `stock_error` | Alerta vermelho — recarrega produtos |
| `server_error` | Alerta vermelho — permite retry com novo `uid` |

## Decisões técnicas

- **Vite + React (JavaScript)** — alinhado à preferência da Parte 1.A
- **CSS puro** — layout simples, sem biblioteca de UI
- **Anti-duplo-clique** — botão desabilitado + `uid` único por tentativa
- **Polling de pedido** — acompanha processamento assíncrono do ERP simulado

## Checklist de teste manual

- [ ] Produtos carregam ao abrir a página
- [ ] Seleção de produto destaca o card
- [ ] Checkout com sucesso retorna mensagem e inicia tracking
- [ ] Quantidade maior que estoque exibe erro
- [ ] Produto sem estoque não pode ser selecionado
- [ ] Botão fica desabilitado durante processamento
- [ ] Status evolui: pending → processing → completed/failed
- [ ] Após erro, produto e quantidade permanecem selecionados para retry

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |

## Limitações

- Sem autenticação ou pagamento
- Sem testes E2E automatizados (checklist manual documentado)
- Layout funcional, não elaborado (conforme escopo do desafio)
