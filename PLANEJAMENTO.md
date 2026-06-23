# Doit - Planejamento

## Visao geral

Doit e um app de tarefas orientado a projetos, dias e prazos. Usuarios entram com Google OAuth, participam de projetos, criam tarefas, atribuem responsaveis e podem sincronizar tarefas com o Google Calendar de acordo com preferencias globais e por projeto.

## Objetivos principais

- Autenticacao com Google OAuth.
- Projetos com nome, cor, dono e membros.
- Convites por email e por link.
- Tarefas agrupadas por projeto e dia.
- Busca global em projetos dos quais o usuario participa.
- Sidebar de detalhe da tarefa ao selecionar uma tarefa.
- Alteracao de dia, prazo, status, responsavel e descricoes.
- Sincronizacao opcional com Google Calendar.
- API REST NestJS documentada via Swagger para geracao de client TypeScript Axios.
- Front Next.js consumindo a API gerada em `client/services/api-back`.

## Stack

### Client

- Next.js + React.
- Tailwind CSS.
- shadcn/ui.
- React Hook Form.
- Zod.
- NextAuth apenas se for necessario manter sessao no client; a autoridade de autenticacao e integracoes Google deve ficar no back.
- Google OAuth iniciado/gerenciado pelo back.
- Google Calendar via API do back.
- Cleave Input para mascaras e validacoes visuais especificas.
- Drag and drop para ordenar tarefas e mover entre dias.
- Tema dark/light.
- API gerada por `openapi-generator-cli`.
- Hooks em `client/services/hooks`, separados por modulo.

### Server

- NestJS.
- Prisma ORM.
- MySQL no Supabase.
- DTOs Nest com `class-validator` e `class-transformer` para validacoes de request.
- Swagger/OpenAPI.
- Google OAuth e Google Calendar concentrados no back.
- REST API consumida pelo client.

## Modelo de dominio

### User

Representa a pessoa autenticada via Google.

Campos principais:

- `id`
- `name`
- `email`
- `avatarUrl`
- `googleAccountId`
- `googleAccessToken` criptografado
- `googleRefreshToken` criptografado
- `calendarSyncEnabled`
- `createdAt`
- `updatedAt`

### Project

Representa um agrupador de tarefas.

Campos principais:

- `id`
- `name`
- `color`
- `ownerId`
- `createdAt`
- `updatedAt`

Regras:

- Quem cria o projeto vira dono.
- O dono tambem e o primeiro membro.
- Apenas o dono pode remover usuarios do projeto.

### ProjectMember

Relaciona usuario e projeto.

Campos principais:

- `id`
- `projectId`
- `userId`
- `role`: `OWNER` ou `MEMBER`
- `calendarSyncMode`: `ALL`, `ONLY_NEW`, `NONE`
- `joinedAt`

### ProjectInvite

Controla convite por email ou link.

Campos principais:

- `id`
- `projectId`
- `email`
- `token`
- `status`: `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`
- `createdById`
- `expiresAt`
- `createdAt`
- `acceptedAt`

Regras:

- Ao abrir convite, usuario deve estar logado.
- Se nao tiver cadastro, deve cadastrar via Google.
- Ao aceitar, entra no projeto e escolhe preferencia de sincronizacao do Calendar para aquele projeto.

### Task

Representa uma tarefa vinculada a um projeto.

Campos principais:

- `id`
- `projectId`
- `createdById`
- `responsibleId`
- `title`
- `description`
- `details`
- `day`
- `deadline`
- `status`: `PENDING`, `IN_PROGRESS`, `DONE`, `CANCELED`
- `order`
- `googleCalendarEventId`
- `createdAt`
- `updatedAt`

Regras:

- Deve pertencer a um projeto do qual o criador participa.
- Responsavel, quando informado, deve ser membro do projeto.
- Ao criar ou alterar data/prazo/responsavel, o back decide se cria/atualiza/remove evento no Google Calendar conforme preferencias do usuario.
- Usuario pode mover tarefa de dia via drag and drop.
- Usuario pode excluir tarefa.

### CalendarSyncPreference

Pode ser simplificada dentro de `User` e `ProjectMember`, mas o comportamento esperado e:

- Preferencia global do usuario: permite ou bloqueia sincronizacao geral com Google Calendar.
- Preferencia por projeto: `ALL`, `ONLY_NEW`, `NONE`.

## Fluxos principais

### Cadastro/login

1. Usuario entra com Google.
2. Back valida OAuth, cria ou atualiza usuario.
3. Logo apos primeiro cadastro, client exibe modal perguntando se deseja permitir criacao de tarefas no Google Calendar.
4. Escolha salva no perfil.
5. Usuario pode mudar essa preferencia depois.

### Criacao de projeto

1. Usuario informa nome e cor.
2. Back cria projeto.
3. Back cria membro com role `OWNER`.
4. Client carrega o projeto ativo.

### Convite para projeto

1. Dono convida por email ou cria link.
2. Back gera convite com token.
3. Pessoa acessa convite.
4. Se nao estiver logada, faz login/cadastro com Google.
5. Antes de entrar, escolhe sincronizacao do Calendar para o projeto:
   - incluir tarefas existentes e futuras;
   - incluir apenas novas tarefas;
   - nao incluir tarefas.
6. Back cria membro e aplica preferencia escolhida.

### Criacao de tarefa

1. Usuario cria tarefa em um projeto.
2. Back valida permissao no projeto.
3. Back salva tarefa.
4. Se sincronizacao estiver habilitada para o responsavel, cria evento no Google Calendar dele.
5. Back salva `googleCalendarEventId`.

### Troca de projeto

1. Usuario seleciona projeto.
2. Client busca tarefas pendentes daquele projeto.
3. Tarefas aparecem agrupadas por dia.
4. Ao clicar numa tarefa, a tela rola ate o dia/tarefa e abre a sidebar de detalhe.

### Busca global

1. Usuario pesquisa por titulo, descricao, detalhe, responsavel, status ou projeto.
2. Back pesquisa apenas em projetos dos quais o usuario e membro.
3. Client mostra resultados com projeto, dia e status.
4. Ao selecionar resultado, troca para o projeto correto, navega ate a tarefa e abre detalhe.

## Modulos do back

- `auth`: Google OAuth, sessao/token da API, perfil autenticado.
- `users`: perfil, preferencias globais, avatar, conta Google.
- `projects`: CRUD de projetos, membros, permissoes.
- `invites`: convite por email/link, aceitar, recusar, expirar.
- `tasks`: CRUD, movimentacao, status, responsavel, ordenacao.
- `calendar`: integracao Google Calendar, criacao/edicao/remocao de eventos.
- `search`: busca global.
- `prisma`: client Prisma e transacoes.
- `config`: variaveis de ambiente.

## Endpoints REST iniciais

### Auth

- `GET /auth/google`
- `GET /auth/google/callback`
- `POST /auth/logout`
- `GET /auth/me`

### Users

- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/calendar-preferences`

### Projects

- `GET /projects`
- `POST /projects`
- `GET /projects/:projectId`
- `PATCH /projects/:projectId`
- `DELETE /projects/:projectId`
- `GET /projects/:projectId/members`
- `PATCH /projects/:projectId/members/:memberId`
- `DELETE /projects/:projectId/members/:memberId`

### Invites

- `POST /projects/:projectId/invites`
- `GET /invites/:token`
- `POST /invites/:token/accept`
- `POST /invites/:token/decline`

### Tasks

- `GET /projects/:projectId/tasks`
- `POST /projects/:projectId/tasks`
- `GET /tasks/:taskId`
- `PATCH /tasks/:taskId`
- `DELETE /tasks/:taskId`
- `PATCH /tasks/:taskId/move`
- `PATCH /tasks/:taskId/status`
- `PATCH /tasks/:taskId/responsible`

### Search

- `GET /search/tasks?q=`

### Swagger

- `GET /api`
- `GET /api-json`

Comando esperado para gerar client:

```bash
openapi-generator-cli generate -i http://localhost:3333/api-json -g typescript-axios -o services/api-back --skip-validate-spec
```

## Estrutura esperada do client

```text
client/
  app/
  components/
    doit/
    ui/
  lib/
  services/
    api-back/
    hooks/
      useAuthHook.ts
      useUsersHook.ts
      useProjectsHook.ts
      useInvitesHook.ts
      useTasksHook.ts
      useSearchHook.ts
      useCalendarHook.ts
```

## Hooks do client

- `useAuthHook`: login, logout, usuario atual.
- `useUsersHook`: perfil e preferencias.
- `useProjectsHook`: listar/criar/editar projetos, membros.
- `useInvitesHook`: criar convite, carregar convite, aceitar/recusar.
- `useTasksHook`: listar, criar, editar, mover, excluir tarefas.
- `useSearchHook`: busca global.
- `useCalendarHook`: preferencias e acoes de sincronizacao.

## Priorizacao de implementacao

### Fase 1 - Fundacao

- Configurar Prisma + MySQL.
- Criar schema inicial.
- Configurar Swagger.
- Configurar `ValidationPipe` global com DTOs validados por `class-validator`.
- Configurar auth Google no back.
- Criar `GET /auth/me`.
- Criar geracao inicial do client OpenAPI.

### Fase 2 - Projetos e membros

- CRUD de projetos.
- Criacao automatica do dono como membro.
- Listagem de projetos do usuario.
- Permissoes basicas por projeto.
- Remocao de membros apenas pelo dono.

### Fase 3 - Tarefas

- CRUD de tarefas.
- Agrupamento por dia.
- Status, responsavel, prazo, ordenacao.
- Mover tarefa entre dias.
- Busca global.

### Fase 4 - Convites

- Convite por email.
- Convite por link/token.
- Aceitar/recusar convite.
- Escolha de preferencia de Calendar ao entrar no projeto.

### Fase 5 - Google Calendar

- Preferencia global pos-cadastro.
- Preferencia por projeto.
- Criar eventos para tarefas.
- Atualizar eventos ao mudar dia/prazo/responsavel.
- Remover evento ao excluir tarefa ou desabilitar sincronizacao.

### Fase 6 - UX final

- Integrar front com hooks reais.
- Drag and drop.
- Sidebar de detalhe.
- Troca de projeto carregando pendentes.
- Busca global navegando ate tarefa.
- Dark/light completo.
- Estados de loading, vazio e erro.

## Variaveis de ambiente previstas

### Server

```env
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3333/auth/google/callback
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
```

### Client

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Decisoes importantes

- O back deve ser a fonte de verdade para autenticacao e integracoes Google.
- Tokens Google devem ser armazenados criptografados.
- O client nao deve chamar Google Calendar diretamente.
- OpenAPI deve ser mantido sempre valido para permitir geracao do client.
- Todas as rotas devem declarar DTOs de request e response no Swagger para que o `openapi-generator` gere tipos uteis no front.
- A sincronizacao com Calendar deve ser idempotente, evitando eventos duplicados.
- Alteracoes em tarefas devem usar transacoes quando tambem envolverem eventos externos ou logs internos.

## Pendencias de definicao

- Se uma tarefa sem responsavel deve ir para o Calendar de quem criou ou nao criar evento.
- Se membros podem editar qualquer tarefa do projeto ou apenas tarefas criadas/atribuidas a eles.
- Se o dono pode transferir propriedade do projeto.
- Se status `DONE` deve remover, manter ou marcar evento no Calendar.
- Se convites por email exigem envio real de email na primeira versao ou apenas link copiavel.
