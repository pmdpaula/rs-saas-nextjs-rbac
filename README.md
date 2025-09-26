# SaaSs NextJs RBAC

Projeto desenvolvido na Rocketseat para uma aplicação SaaS

## Tecnologias utilizadas

- Next.js
- TurboRepo

## Estudo

### Comandos

- Iniciando o projeto

```bash
pnpm dlx create-turbo@latest
```

- Ajustes iniciais

```bash
mkdir config
mv packages/eslint-config config/eslint-config
mv packages/tsconfig-config config/tsconfig-config

rm -rf apps/web
rm -rf apps/docs
```

- Renomeado projetos no config

Alterado o nome do projeto no package.json dos configs, colocando @saas ao invés de @repo. Aqui pode ser um nome qualquer.

- Ajuste no package.json raiz

Adicionado no package.json raiz as dependências de desenvolvimento dos configs

```json
{
  "devDependencies": {
    "@saas/eslint-config": "workspace:^",
    "@saas/typescript-config": "workspace:^",
    "..."
  }
}
```
Removido em seguida.

- Ajuste no eslint-config

  * Importado os seguintes pacotes:
    * prettier
    * prettier-plugin-tailwindcss
    * eslint-plugin-simple-import-sort

  * Criado o arquivo prettier.js com a configuração do Prettier
  * Adicionado o prettierConfig na configuração do eslint
