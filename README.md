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


# Next.js SaaS + RBAC

This project contains all the necessary boilerplate to setup a multi-tenant SaaS with Next.js including authentication and RBAC authorization.

## Features

### Authentication

- [ ] It should be able to authenticate using e-mail & password;
- [ ] It should be able to authenticate using Github account;
- [ ] It should be able to recover password using e-mail;
- [ ] It should be able to create an account (e-mail, name and password);

### Organizations

- [ ] It should be able to create a new organization;
- [ ] It should be able to get organizations to which the user belongs;
- [ ] It should be able to update an organization;
- [ ] It should be able to shutdown an organization;
- [ ] It should be able to transfer organization ownership;

### Invites

- [ ] It should be able to invite a new member (e-mail, role);
- [ ] It should be able to accept an invite;
- [ ] It should be able to revoke a pending invite;

### Members

- [ ] It should be able to get organization members;
- [ ] It should be able to update a member role;

### Projects

- [ ] It should be able to get projects within a organization;
- [ ] It should be able to create a new project (name, url, description);
- [ ] It should be able to update a project (name, url, description);
- [ ] It should be able to delete a project;

### Billing

- [ ] It should be able to get billing details for organization ($20 per project / $10 per member excluding billing role);

## RBAC

Roles & permissions.

### Roles

- Owner (count as administrator)
- Administrator
- Member
- Billing (one per organization)
- Anonymous

### Permissions table

|                          | Administrator | Member | Billing | Anonymous |
| ------------------------ | ------------- | ------ | ------- | --------- |
| Update organization      | ✅            | ❌     | ❌      | ❌        |
| Delete organization      | ✅            | ❌     | ❌      | ❌        |
| Invite a member          | ✅            | ❌     | ❌      | ❌        |
| Revoke an invite         | ✅            | ❌     | ❌      | ❌        |
| List members             | ✅            | ✅     | ✅      | ❌        |
| Transfer ownership       | ⚠️            | ❌     | ❌      | ❌        |
| Update member role       | ✅            | ❌     | ❌      | ❌        |
| Delete member            | ✅            | ⚠️     | ❌      | ❌        |
| List projects            | ✅            | ✅     | ✅      | ❌        |
| Create a new project     | ✅            | ✅     | ❌      | ❌        |
| Update a project         | ✅            | ⚠️     | ❌      | ❌        |
| Delete a project         | ✅            | ⚠️     | ❌      | ❌        |
| Get billing details      | ✅            | ❌     | ✅      | ❌        |
| Export billing details   | ✅            | ❌     | ✅      | ❌        |

> ✅ = allowed
> ❌ = not allowed
> ⚠️ = allowed w/ conditions

#### Conditions

- Only owners may transfer organization ownership;
- Only administrators and project authors may update/delete the project;
- Members can leave their own organization;
