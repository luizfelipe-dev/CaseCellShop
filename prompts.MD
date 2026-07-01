Inicie um novo projeto Node para o backend em uma pasta chamada Backend

O backend deve possuir a arquitetura: index > routes > controller (endpoints) > service (regras de negocio) e schema (validacao com Joi) > repository (chamadas ao banco)

Deve haver tambem uma pasta Schema para validacao dos dados, importado no service

Deve haver uma pasta utils com um arquivo util.js para armazenar as funcoes auxiliares que possam ser utilizadas em mais de um arquivo

O banco de dados deverá ser em mongodb

Instale redis para cache e bullMQ para filas e workers

Crie seeds dos produtos e estoque

siga o arquivo desafio_parte_1A.MD para modelagem dos dados e criacao da api