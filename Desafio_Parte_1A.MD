<h3>Parte 1.A — Perguntas Conceituais<h3>

### O que você acredita estar causando o problema?

O problema pode estar sendo causado por vários motivos:
    Para carregar os produtos da vitrine, há falta de cacheamento da consulta que traz os itens, gerando repetidas consultas ao banco de dados que poderiam ser evitadas. Também pode haver queries com baixa performance que causem gargalo no sistema. 

    A falta de consistência no estoque pode estar sendo ocasionada pela falta de validação do mesmo no momento final da compra.

    O checkout está com problemas pois requer que o sistema esteja atendendo todos os usuários sincronicamente, fazendo com que todas as consultas ao ERP sobrecarreguem as APIS.

### Qual é o impacto para o cliente e para o negócio?

    O impacto é extremamente negativo para o negócio e para os clientes. 
    
    Para o negócio, causará real perda de acessos e de vendas uma vez que o usuário tende a deixar de comprar por ter que lidar com lentidão e falta de confiabilidade no sistema.

    Para o cliente, ao notar lentidão e erros ao finalizar compras, optará pela loja concorrente que oferecer um sistema mais rápido e confiável, já que houve quebra de expectativa.

### Quais seriam pelo menos 2 caminhos possíveis de solução?

Vitrine:
    Acredito que o caminho mais rápido para o problema da vitrine é armazenar em memória a consulta que traz os produtos, evitando multiplas consultas ao banco de dados e ganhando muita performance, junto com a sensação de um sistema mais ágil. Uma solução técnica pode ser o Redis, sistema open-source para cacheamento muito conhecido.

    Uma segunda solução menos prática seria criar um banco próprio com apenas os dados que precisaremos, sincronizando com o banco do ERP, para que ao invés de consultar o ERP toda vez, consultemos nosso próprio banco de dados. Assim podemos ganhar performance incluindo melhorias nas queries, melhorarando os índices, e passaríamos a ter mais controle sobre a estrutura do banco.

Estoque:

    Para garantir a consistência no estoque, antes de finalizar a compra, adicionaria uma reserva de estoque - ao adicionar no carrinho por exemplo, o estoque já é subtraído por um período de tempo. 

    Outra solução seria controlar direto no banco usando transactions, que trava o banco de dados até que a operação seja concluída.

Checkout:
    Para o problema do checkout, uma solução performática seria tornar o checkout assíncrono, enfileirando a mensagem ao invés de consultar o banco diretamente. Assim, se o banco cair, podemos programar uma nova tentativa futura para quando o banco voltar, mas já podemos devolver a mensagem imediatamente para o usuário

    Outra solução seria implementar um circuit breaker, pois assim, quando o sistema cair ou ficar lento, já podemos evitar que novas chamadas sejam enviadas e não deixe o sistema ainda mais lento, avisando o usuário que o pedido será processado assim que o sistema voltar ao normal.

### Quais trade-offs, riscos ou custos cada caminho traz?

Vitrine: 
    O uso do cache é a opção mais rápida de aplicar, mas deixa a manutenção do código um pouco mais complexa e também deixa os dados desatualizados por um curto período de tempo.
    A sincronizaçãi de banco tem maior complexidade pra implementar e sempre dependerá da atualização/sincronismo, mas a longo prazo parece ser mais escalável por reduzir a dependencia do ERP.  

Estoque:
    Como usamos reserva de estoque, o estoque tende a diminuir por um período de tempo. Seria necessario implementar toda uma lógica pra fazer com que o estoque volte ao real caso o cliente não compre.
    Para usar transactions, perdemos performance no banco caso muitas requisicoes sejam feitas juntas, pois o banco travará as transações.

Checkout:
    Adicionar filas e workers aumentam a complexidade do desenvolvimento e da manutenção do código
    Adicionar circuit-breakers também aumenta a complexidade já que precisaríamos  definir o tempo de abertura e fechamento do circuito e melhorar significativamente o monitoramento das transações

### Qual caminho você priorizaria primeiro e por quê?

    Eu utilizaria as primeiras soluções apresentadas acima por serem mais simples e terem impacto rápido, fazendo com que o sistema melhore significativamente em curto período de tempo.
    Caso ainda surja a necessidade de implementação da segunda solução, podemos planejar com calma enquanto a primeira solução já estiver sendo executada e o sistema já se apresentar mais robusto.

<h3>Pergunta 2 — Arquitetura alvo incremental</h3>

### Proponha uma arquitetura para evoluir a loja sem depender diretamente do ERP em cada requisição crítica. Na resposta, descreva:

Componentes principais;

Front-end em JS + React (tenho pouca prática com Typescript e POO);
API da Loja (Node.js);
Banco de dados próprio da loja (PostgreSQL);
Redis para cache;
Fila de mensagens (RabbitMQ);
Worker para processamento assíncrono do checkout (BullMQ);
Jobs de sincronização entre ERP e banco da loja.

### qual o fluxo de dados para produtos, estoque e checkout?

Os produtos seriam sincronizados periodicamente do ERP para o banco da loja através de um Job. A vitrine consultaria apenas o banco da loja, utilizando Redis para cache das consultas mais frequentes

O estoque também seria sincronizado periodicamente com o ERP. Durante o checkout, a API da loja realizaria a reserva do estoque no banco próprio, evitando vendas duplicadas. Posteriormente essa informação seria sincronizada com o ERP

No checkout, a API valida os dados, reserva o estoque e registra o pedido no banco da loja. Depois, enviamos uma mensagem para uma fila onde um worker consome essa fila e faz a integração com o ERP


### onde usaria cache, fila, banco próprio da loja, jobs ou workers?

Usaria cacheamento nas consultas dos produtos mais acessados, e/ou num get principal da vitrine

Usaria banco próprio da loja pra armazenamento produtos, estoque e reservas de estoque e  pedidos 

Usaria mensageria com as filas no checkout da integração com o ERP

Usaria worker p/ consumir a fila, processar os pedidos, realizar retentativas e na comunicação com o ERP

Usaria os jobs pra sincronizar produtos, preços e estoque entre ERP e banco da loja

### como lidaria com sincronização entre loja e ERP?

Através dos jobs, que são uma espécie de agendadores de serviços que estipulamos um período para que seja feita a sincronização. Seria importante agendar em um momento do dia em que haja baixa atividade no sistema


### o que você implementaria primeiro em um plano de 30 a 90 dias?

Na ordem, eu faria assim:

    Criaçãoo do Banco próprio da loja, com as tabelas e índices:
        - produtos
        - estoque
        - reserva
        - pedidos
    Implementacao dos jobs de sincronizacao do ERP > Loja
        - Sincronizar produtos
        - Sincronizar estoques
    Implementação do cache nos produtos da vitrine, ja com o banco proprio da loja
    Implementação do sistema de reserva de estoque
    Implemnntação da Fila e Workers com retry e idempotência
    Implementação de monitoria com logs mais precisos
    Bonus: Caso haja tempo, analisar substituição da sincronização periódica por webhooks 

<h3>Pergunta 3 — Estoque, concorrência e idempotência</h3>
Imagine que dois clientes tentam comprar a última unidade do mesmo produto ao mesmo tempo.

### como sua solução evita venda duplicada?

    A venda duplicada é evitada através da implementação do sistema de reserva de estoque.

    No checkout, antes de enviar o pedido ao ERP, a API da loja verifica a disponibilidade do produto e realiza uma reserva no banco de dados em uma transação. Se 2 clientes tentarem comprar a última unidade ao mesmo tempo, apenas a primeira transação conseguirá reservar o item; a segunda receberá uma mensagem de erro informando que o produto não está mais dispon;ivel

### se existe reserva de estoque, quando ela é criada e quando expira?

    Podemos reservar o estoque quando o usuario entra no checkout e podemos estipular um tempo, por exemplo, 15 minutos, para voltar ao estoque caso não efetue a compra

### como o checkout lida com retry, timeout ou duplo clique?

    Após validar os dados e reservar o estoque, a API registra o pedido e o envia para a fila, onde o worker fica responsável por realizar a integração com o ERP.

    Se houver timeout ou queda do ERP, o Worker realiza o retry. Podemos configurar numero de tentativas e deadQueues (filas com mensagens de erro)

    Pra evitar casos de duplo clique, implementanos no front a desabilitação do botão após primeiro clique de finalizar a compra. No backend, usamos um id para garantir que a mesma compra não seja processada mais de uma vez.


### como usaria idempotência para evitar pedidos duplicados?

    Cada requisição no checkout deve possuir um id único pra que seja verificado no banco se a mesma já foi solicitada.

### como reconciliaria divergências entre loja e ERP?

    Utilizaria os jobs para periodicamente comparar o banco da loja com o banco do ERP e atualizar caso haja diferenças
    Tambem adicionaria formas de salvar em banco essas diferenças para maior controle como em uma tabela separada salvando a data da sincronizacao e a diferenca entre tabelas


<h3>Pergunta 4 — Contrato de API e modelo de erros</h3>

### Defina um contrato para o endpoint principal de checkout, por exemplo POST /checkout ou POST /orders.
Inclua:

### payload mínimo de entrada;

    {
        "uid": "3d8f4d7a-91d5-4f67-a3c5-0b6ef4c91234",
        "productId": 1,
        "amount": 2
    }


### resposta de sucesso;

    Status 202 (pois há filas)

    { 
        "message": "O pedido foi recebido com sucesso e será processado" 
    }

### resposta para erro de validação;

    Status 400

    { 
        "errorCode": "user_request_error",
        "message": "Dados inválidos." 
    }

### resposta para estoque insuficiente;

    Status 400

    {
        "errorCode": "stock_error",
        "message": "Não há mais itens disponíveis."
    }


### resposta para falha temporária do ERP ou processamento assíncrono;

    Status: 500 ou 503

    {
        "errorCode": "server_error",
        "message": "Estamos com uma instabilidade temporária. Tente novamente mais tarde.
    }


Códigos HTTP , errorCode e mensagem amigável quando fizer sentido;
### Como o front-end deveria reagir a cada tipo de erro?

    O frontend pode utilizar o campo message para retornar as mensagens do jeito que o backend entrega ou utilizar o campo errorCode para personalizar uma mensagem própria.

<h3>Pergunta 5 — Testes e estratégia de validação</h3>
### Descreva como você testaria a solução.

Considere:
### testes unitários;
    Usaria para validar dados e validar estoque

### testes de integração da API;
    Usaria em listagem de produtos, em checkout com sucesso ou de erros, em erros de validação, em quando o sistema do ERP ficar lento ou indisponivel

### testes de contrato entre front-end e back-end;
    Usaria nos status e nos campos do contrato, principalmente nos errorCode

### cenários de concorrência ou múltiplas tentativas;
    Tentaria simular uma compra com e sem concorrência

### testes de estados do front-end;
    Usaria nos carregamentos dos produtos, no botão para evitar duplo clique, nas mensagens de sucesso e de erro


### o que você automatizaria agora e o que deixaria documentado como próximo passo.
    Começaria pelo mais simples que são os testes unitários, depois seguiria para os testes de integração com a API e por ultimo os testes de concorrência e de queda no sistema 


<h3>Pergunta 6 — Uso de IA no desenvolvimento</h3>
Se usar IA para apoiar a solução:

### que tipo de prompt você usaria?

    Eu implementaria com IA-First, usando IA desde o início da implementação e ao longo de todo o desenvolvimento, para ganhar tempo.

    Como eu já pensei e planejei todas as perguntas deste desafio, passaria partes desse proprio documento como insumo para a IA, pois nela já pensamos em praticamente tudo que precisaremos desenvolver, como:

        - Os problemas atuais
        - As soluções e a prioridade delas
        - As tecnologias a serem utilizadas


### que partes você delegaria ou não delegaria à IA?

    Usaria a IA em todas as etapas do processo - na arquitetura, na implementação, no desenvolvimento dos testes e da documentação, assim ganhamos muito tempo.

    Porém a decisão final sobre arquitetura, das regras de negócio e dos trade-offs sempre devem ser do desenvolvedor, e não da IA, servindo ela apenas para acelerar e não para decidir.  

### como verificaria se a resposta está correta?

    Primeiro verifico as alterações do arquivo modificado apresentado pela IA, onde
    verifico pontos essenciais das modificações como regras de negócio e qualidade do código. 

    Depois melhoro a leitura do código, separando em funcoes menores as responsabilidades, revejo a nomenclatura das variaveis e funcoes, verifico se há caminho melhor para a lógica

    Por último, verificamos se os testes automatizados são contemplados e fazemos os testes reais na aplicação


### que riscos existem ao aceitar uma sugestão de IA sem revisão?

    Os riscos são enormes e podem quebrar totalmente a aplicação. Além disso, pode ser exposto algum dado sigiloso como uma variável de ambiente por exemplo. Também há riscos de comprometer a base de dados ou expor informações sensíveis. 
