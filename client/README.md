# doit — Next.js + TypeScript + Tailwind + shadcn/ui

App de tarefas **por projeto** e **por dia**, com projetos compartilháveis, histórico de
alterações, prazos, calendário com status e busca global. Exportado do protótipo para uma
base Next.js pronta para produção.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** com tokens de tema (claro/escuro) em CSS variables
- **shadcn/ui** (Radix primitives) — `components/ui`
- **react-hook-form** + **zod** nos formulários (criar tarefa, novo projeto, convite)
- **next-themes** para o tema claro/escuro
- **lucide-react** para ícones

## Como rodar

```bash
cd nextjs-doit
npm install      # ou pnpm install / yarn
npm run dev      # http://localhost:3000
```

> Requer Node 18.17+.

## Estrutura

```
app/
  layout.tsx          # fontes, ThemeProvider, StoreProvider
  page.tsx            # renderiza <DoitApp/>
  globals.css         # tokens shadcn (HSL) + tokens doit (claro/escuro)

components/
  ui/                 # primitivos shadcn (button, dialog, sheet, popover, select,
                      #   command, input, textarea, label, badge, avatar, separator, form)
  doit/               # componentes de domínio
    doit-app.tsx      # orquestra layout + estado de UI (modais, drawers, dia atual)
    sidebar.tsx       # lista de projetos
    top-bar.tsx       # navegação por dia, calendário, busca, tema, compartilhar, histórico
    calendar-popover.tsx  # mini-calendário com bolinha de status por dia
    task-list.tsx / task-row.tsx / quick-add.tsx
    task-detail.tsx   # painel lateral (Sheet) de detalhes/edição
    share-modal.tsx   # convite por e-mail (rhf+zod) + link + acessos
    history-drawer.tsx
    summary-modal.tsx # resumo de pendências ao trocar de projeto
    new-project-modal.tsx
    search-palette.tsx # busca global (Command/⌘K)
  theme-provider.tsx

lib/
  types.ts            # tipos de domínio
  date-utils.ts       # helpers de data pt-BR + taskState/dayStatus
  data.ts             # dados-semente (projetos, tarefas, pessoas, atividade)
  schemas.ts          # schemas zod
  store.tsx           # Context + reducer (toda a lógica de domínio)
  utils.ts            # cn()
```

## Onde estão as regras de negócio

- **Status de tarefa / dia** (`lib/date-utils.ts`): `taskState()` retorna
  `done | overdue | pending`; `dayStatus()` aplica a hierarquia da bolinha do calendário
  (vermelho > amarelo > verde > nada).
- **Estado e ações** (`lib/store.tsx`): `toggleTask`, `addTask`, `patchTask`,
  `deleteTask`, `selectProject`, `createProject`, `invite`. Troque o reducer por chamadas
  de API quando plugar um backend — os componentes só consomem `useStore()`.

## Notas de adaptação

- O "hoje" é fixo (`TODAY` em `lib/date-utils.ts`) para os dados-semente lerem de forma
  consistente. Em produção, troque por `new Date()` normalizado para meia-noite.
- O estado é em memória (reducer). Para persistir, conecte `lib/store.tsx` à sua API/DB.
- Os componentes `ui/` seguem o padrão shadcn (new-york). Você pode adicionar/atualizar
  outros com `npx shadcn@latest add <componente>`.
- A fonte é **Hanken Grotesk** via `next/font` (sem requisições externas em runtime).
