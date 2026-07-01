<h1>Parte 1.B — Mini-projeto de Código</h1>

Orientação: suba o código em um repositório público pessoal no GitHub e cole o link no final da sua resposta.


<h2>Escopo da mini-tarefa</h2>

Implemente um pequeno fluxo fullstack de checkout para compra de capinhas de celular.
A aplicação deve permitir que um usuário visualize produtos, escolha uma quantidade e tente finalizar uma compra. O sistema deve lidar com sucesso, erro de validação, estoque insuficiente, tentativa duplicada e falha temporária de processamento.
Você pode usar dados em memória ou banco local. Não é necessário usar autenticação, pagamento real, deploy, cloud real ou layout elaborado.

<h3>O que esperamos observar na entrega</h3>

Back-end
☐ Existe uma API para listar ou consultar produtos.
☐ Existe uma API para criar uma tentativa de compra.
☐ A API valida entradas inválidas.
☐ A API diferencia sucesso, erro de validação, estoque insuficiente e falha técnica.
☐ A solução evita vender mais unidades do que o estoque disponível.
☐ Há alguma estratégia simples contra pedido duplicado?
☐ Há uma simulação clara de processamento lento ou instável do ERP .

Front-end
☐ Existe uma tela simples para listar produtos ou selecionar um produto.
☐ O usuário consegue informar quantidade e iniciar a compra.
☐ A interface mostra loading e evita múltiplos cliques durante o processamento.
☐ A interface exibe mensagens compreensíveis para sucesso, estoque insuficiente, entrada inválida e falha
temporária.
☐ O estado da tela permanece coerente após erro ou retry.


<h2>Qualidade e entrega</h2>

☐ O projeto possui README explicando como instalar e rodar.
☐ O README explica decisões técnicas, limitações e próximos passos.
☐ A escolha de stack é explicada quando diferente da preferencial.
☐ Há testes automatizados ou uma estratégia clara de verificação.
☐ O código está organizado de forma compreensível.
☐ Bônus: incluir diagrama simples, logs estruturados, endpoint de status do pedido ou teste de
concorrência.
☐ PROMPTS.md registra os prompts relevantes, quando aplicável.

<h2>Limites do escopo</h2>

Não esperamos:
● pagamento real;
● autenticação completa;
● integração real com ERP;
● uso obrigatório de Docker;
● deploy em cloud;
● mensageria real em produção;
●  layout sofisticado.

Como entregar

☐ Respostas das 6 perguntas conceituais (Parte 1.A).
☐ Link do repositório GitHub público (Parte 1.B).
☐ README com instruções de execução e decisões técnicas.
☐ PROMPTS.md, quando aplicável.