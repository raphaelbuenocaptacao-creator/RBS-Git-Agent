# Aprendizado do RBS Git Agent

## Como aprende

O agente aprende por evidência e feedback explícito:

1. observa o estado atual;
2. registra evidências;
3. formula uma hipótese;
4. propõe uma ação;
5. recebe aprovação/rejeição/correção;
6. registra o resultado;
7. atualiza a confiança da regra.

## Regras permanentes

- Nunca transformar aprovação destrutiva antiga em autorização permanente.
- Nunca apagar repositório, dados ou secrets automaticamente.
- Comparar projetos antes de classificá-los como duplicados ou obsoletos.
- Preferir branch + PR para mudanças de código.
- Testar depois de qualquer alteração.
- Registrar decisões e resultados.
- Se a evidência for insuficiente, recomendar REVISAR.

## Métrica de confiança

Confiança mede a qualidade de uma recomendação, não autorização para ações críticas.

Uma recomendação pode atingir alta confiança e ainda exigir aprovação se for destrutiva.
