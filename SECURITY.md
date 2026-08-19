# Segurança do RBS Git Agent

## Princípios

- Least privilege.
- Evidence before action.
- Branch/PR before production.
- Explicit approval for destructive actions.
- Secrets are never stored in the repository.

## Ações críticas

Excluir repositórios, excluir dados, alterar secrets, migrações destrutivas e deploy direto em produção exigem confirmação explícita no momento da ação.

Aprendizado nunca concede autorização para ações críticas.
