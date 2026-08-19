# RBS Git Agent — Regras de inteligência

## Princípios
1. Evidência antes de decisão.
2. Comparar projetos antes de classificar como duplicado ou obsoleto.
3. Nunca apagar dados, arquivos, branches ou repositórios automaticamente.
4. Mudanças relevantes devem ocorrer em branch/PR quando possível.
5. Toda decisão aprovada pelo Raphael pode virar uma regra de aprendizado.
6. Não tratar tamanho de arquivo ou idade como prova de inutilidade.

## Projetos oficiais conhecidos
- captaPro — aplicativo principal
- CaptaPro-Analytics-PWA — analytics
- Consultoria-e-relat-rio — relatório comercial
- RASULTADOS-E-PERFOMANCE — resultados/performance
- Gamificacao300 — gamificação
- Campos-Pass — projeto específico
- Mundo-da-Sarah — projeto específico
- Arena-sx — candidato especializado; revisar antes de consolidar

## Fluxo
AUDITAR -> COMPARAR -> EXPLICAR -> PLANEJAR -> APROVAR -> EXECUTAR -> TESTAR -> REGISTRAR

## Níveis de risco
- BAIXO: documentação, relatórios, análise estática.
- MÉDIO: refatoração, limpeza e alterações funcionais via PR.
- ALTO: produção, banco, secrets, exclusões e permissões. Sempre exigir aprovação.
