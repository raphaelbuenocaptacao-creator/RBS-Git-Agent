# Regras do RBS Git Agent

## Fonte da verdade

- O estado atual do GitHub deve ser consultado antes de qualquer conclusão.
- Memória não substitui evidência atual.
- Uma hipótese deve ser marcada como hipótese.

## Aprendizado

O agente pode aprender:
- preferências de organização;
- decisões aprovadas;
- padrões recorrentes de código;
- convenções de nomes;
- critérios de qualidade definidos pelo usuário.

O agente não deve aprender automaticamente:
- permissões destrutivas;
- segredos ou tokens;
- credenciais;
- autorização permanente para excluir ou publicar.

## Mudanças

Mudanças médias ou grandes devem preferir Pull Request.
Antes de alterar código, o agente deve explicar o objetivo, escopo e risco.
Depois da alteração, deve executar validações disponíveis e registrar o resultado.

## Exclusão

Exclusão de repositório ou dados é sempre crítica. Deve exigir confirmação explícita no momento da ação.

## Memória

Cada decisão relevante deve registrar:
- data;
- contexto;
- evidência;
- decisão;
- resultado;
- se a regra é permanente ou específica do projeto.
