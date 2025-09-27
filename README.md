# SaaSs NextJs RBAC

Projeto desenvolvido na Rocketseat para uma aplicação SaaS

SaaS multi-tenant & RBAC

Neste resumo, discutimos a importância de entender conceitos como SaaS (Software as a Service) e RBAC (Role Based Authorization Control) antes de desenvolver um aplicativo. Exploramos as diferenças entre single-tenant e multi-tenant, destacando que multi-tenant não necessariamente significa múltiplos subdomínios. Abordamos a estratégia de permissões, comparando RBAC e ABAC (Attribute Based Authorization Control), e sugerimos manter as permissões e cargos do SaaS no código, simplificando o banco de dados. O projeto abordado ajudará a entender como lidar com permissões no código e no banco de dados.

## Tecnologias utilizadas

- Next.js
- [TurboRepo](https://turborepo.com/docs/getting-started/installation)
- [CASL](https://casl.js.org/) (Controle de Acesso)

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
    ```bash
    pnpm add -D prettier prettier-plugin-tailwindcss eslint-plugin-simple-import-sort
    ```
  * Adicionado as seguintes regras:
    * "simple-import-sort/imports": "error"

  * Criado o arquivo prettier.js com a configuração do Prettier
  * Adicionado o prettierConfig na configuração do eslint
