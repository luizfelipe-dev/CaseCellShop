# Principais Prompts

Como respondi as perguntas no @Desafio_Parte_1A.MD e já pensei em toda a arquitetura previamente, usei o próprio arquivo como insumo para a IA;

Utilizei a técnica AI-First, usando o Cursor no modo Plan, desde o início do projeto - na instalação das Libs, Montagem da Arquitetura, Desenvolvimento, Testes e Readme;

## Backend

Inicie um novo projeto Node para o backend em uma pasta chamada Backend

O backend deve possuir a arquitetura: 
    index > routes > controller (endpoints) > service (regras de negocio), schema (validacao será feita com com Joi), repository (chamadas ao banco) e models (modelagem dos dados do mongodb)

A pasta Schema conterá a validacao dos dados, que serão importados no service

Deve haver uma pasta utils com um arquivo util.js para armazenar as funcoes auxiliares que possam ser utilizadas em mais de um arquivo

O banco de dados deverá ser em mongodb

Instale redis para cache e bullMQ para filas e workers

Crie seeds dos produtos e estoque

Crie um README com instalação e como rodar.

Siga o arquivo @desafio_parte_1A.MD para modelagem dos dados e criacao dos endpoints da api

Crie testes unitários e de integração na pasta tests com os requisitos do @desafio_parte_1A.MD

## Frontend

Inicie um projeto React com Vite na pasta Frontend, consumindo a API local do Backend

Use React Router e CSS puro

Estrutura: components/, pages/, services/api.js, utils/

As rotas do app:
    / — listar produtos, selecionar, informar quantidade e finalizar compra
    /pedidos — listar pedidos
    /reset — resetar banco com confirmação do usuário (deve voltar com estoque dos seeds e resetar os pedidos)

Na página principal:
    GET /products para exibir cards com nome, preço, estoque e imagem

Regras: 
    Produto sem estoque fica desabilitado ("Esgotado")
    Deve haver um campo de busca local para filtrar produtos (bonus)
    Checkout com POST /checkout enviando uid (UUID), productId e amount
    Botão deve ser desabilitado durante o envio (anti-duplo-clique)
    O serviço é assíncrono, então devemos monitorar a resposta em GET /orders/:uid a cada 2s até completed ou failed
    Devem ser criadas mensagens claras para sucesso, estoque insuficiente, dados inválidos e erro do servidor (usar o campo errorCode da API)

Crie um README com instalação e como rodar.

Siga o @Desafio_Parte_1B.MD para o fluxo de checkout.

