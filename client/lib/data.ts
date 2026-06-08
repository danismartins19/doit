/* ============ doit — seed data ============ */
import type { Person, Project, Task, Activity } from "./types";
import { TODAY, addDays, iso, uid } from "./date-utils";

export const PEOPLE: Record<string, Person> = {
  me: { id: "me", name: "Você", email: "voce@doit.app", color: "#1d2433" },
  ana: { id: "ana", name: "Ana Martins", email: "ana.martins@email.com", color: "#8b5cf6" },
  lucas: { id: "lucas", name: "Lucas Reis", email: "lucas.reis@email.com", color: "#1f9d63" },
  bia: { id: "bia", name: "Bia Souza", email: "bia.souza@email.com", color: "#e5557a" },
};

export const PROJECTS: Project[] = [
  {
    id: "trabalho",
    name: "Trabalho",
    color: "var(--p-blue)",
    raw: "#3d7ff5",
    members: ["me", "ana", "lucas"],
    shareLink: "doit.app/p/trabalho-9f2a",
  },
  {
    id: "colegio",
    name: "Colégio",
    color: "var(--p-violet)",
    raw: "#8b5cf6",
    members: ["me", "bia"],
    shareLink: "doit.app/p/colegio-3kd1",
  },
  {
    id: "casa",
    name: "Casa",
    color: "var(--p-green)",
    raw: "#1f9d63",
    members: ["me"],
    shareLink: "doit.app/p/casa-7m0x",
  },
];

/** Build a task: offset = day relative to today; ddl = deadline offset (or null). */
function T(
  projectId: string,
  offset: number,
  title: string,
  done: boolean,
  ddl: number | null,
  by = "me",
  notes = "",
): Task {
  return {
    id: uid("t"),
    projectId,
    date: iso(addDays(TODAY, offset)),
    title,
    done,
    deadline: ddl === null ? null : iso(addDays(TODAY, ddl)),
    by,
    notes,
  };
}

export const TASKS: Task[] = [
  // ---- Trabalho ----
  T("trabalho", 0, "Revisar o PR do novo onboarding", false, 0, "me"),
  T("trabalho", 0, "Responder e-mail do cliente Vortex", true, null, "me"),
  T("trabalho", 0, "Fazer isso no carro", false, null, "me", "Ligar pro escritório enquanto dirijo."),
  T("trabalho", 0, "Atualizar o board da sprint", false, null, "ana"),
  T("trabalho", -1, "Enviar o relatório mensal", false, -1, "me", "Faltou anexar o gráfico de receita."),
  T("trabalho", -1, "Deploy da versão 2.1", true, null, "lucas"),
  T("trabalho", -2, "Reunião de planejamento", true, null, "ana"),
  T("trabalho", 1, "Preparar apresentação para a diretoria", false, 1, "me"),
  T("trabalho", 1, "Revisar orçamento do Q3", false, 1, "ana"),
  T("trabalho", 2, "Call com o fornecedor", false, 2, "lucas"),
  T("trabalho", -3, "Assinar contrato do freelancer", false, -3, "me", "Atrasado — cobrar o RH."),

  // ---- Colégio ----
  T("colegio", 0, "Estudar para a prova de cálculo", false, 0, "me"),
  T("colegio", 0, "Ler o capítulo 4 de história", false, null, "me"),
  T("colegio", -1, "Entregar o trabalho de redação", false, -1, "me", "Tema: meio ambiente, mín. 2 páginas."),
  T("colegio", 1, "Reunião do grupo de TCC", false, null, "bia"),
  T("colegio", 2, "Projeto de biologia", false, 2, "bia"),
  T("colegio", -2, "Resolver lista de exercícios", true, null, "me"),

  // ---- Casa ----
  T("casa", 0, "Comprar mantimentos da semana", false, null, "me"),
  T("casa", 0, "Regar as plantas", true, null, "me"),
  T("casa", 1, "Pagar a conta de luz", false, 1, "me"),
  T("casa", -3, "Consertar a torneira da cozinha", false, -3, "me", "Comprar o reparo na loja antes."),
  T("casa", 3, "Marcar revisão do carro", false, 3, "me"),
];

function A(
  projectId: string,
  by: string,
  kind: Activity["kind"],
  target: string | null,
  dOffset: number,
  time: string,
): Activity {
  return { id: uid("a"), projectId, by, kind, target, date: iso(addDays(TODAY, dOffset)), time };
}

export const ACTIVITY: Activity[] = [
  A("trabalho", "ana", "add", "Atualizar o board da sprint", 0, "09:42"),
  A("trabalho", "me", "complete", "Responder e-mail do cliente Vortex", 0, "09:15"),
  A("trabalho", "me", "create", null, 0, "08:50"),
  A("trabalho", "lucas", "complete", "Deploy da versão 2.1", -1, "17:30"),
  A("trabalho", "ana", "deadline", "Revisar orçamento do Q3", -1, "14:08"),
  A("trabalho", "me", "add", "Call com o fornecedor", -1, "11:20"),
  A("trabalho", "ana", "join", null, -2, "10:00"),
  A("trabalho", "ana", "complete", "Reunião de planejamento", -2, "16:45"),

  A("colegio", "me", "add", "Estudar para a prova de cálculo", 0, "07:30"),
  A("colegio", "bia", "add", "Projeto de biologia", -1, "20:10"),
  A("colegio", "me", "complete", "Resolver lista de exercícios", -2, "22:05"),
  A("colegio", "bia", "join", null, -2, "19:00"),

  A("casa", "me", "complete", "Regar as plantas", 0, "08:00"),
  A("casa", "me", "add", "Marcar revisão do carro", -1, "13:15"),
];
