/* ============ doit — date helpers (pt-BR) ============ */
import type { Task, DayStatus, TaskState } from "./types";

/** Project "today" — fixed so the seed data reads consistently.
 *  In a real app, replace with `new Date()` (normalized to midnight). */
export const TODAY = (() => {
  const d = new Date(2026, 5, 6); // 6 jun 2026
  d.setHours(0, 0, 0, 0);
  return d;
})();

export const WD = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
export const WD_LONG = [
  "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado",
];
export const MO = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];
export const MO_LONG = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function iso(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}

/** "Hoje" / "Amanhã" / "Ontem" / weekday */
export function relLabel(date: Date): string {
  const n = diffDays(date, TODAY);
  if (n === 0) return "Hoje";
  if (n === 1) return "Amanhã";
  if (n === -1) return "Ontem";
  if (n === 2) return "Depois de amanhã";
  if (n === -2) return "Anteontem";
  return WD_LONG[date.getDay()];
}

export function relShort(date: Date): string {
  const n = diffDays(date, TODAY);
  if (n === 0) return "Hoje";
  if (n === 1) return "Amanhã";
  if (n === -1) return "Ontem";
  return `${WD[date.getDay()]}, ${date.getDate()} ${MO[date.getMonth()]}`;
}

export function fullDate(date: Date): string {
  return `${WD_LONG[date.getDay()]}, ${date.getDate()} de ${MO_LONG[
    date.getMonth()
  ].toLowerCase()} de ${date.getFullYear()}`;
}

export function medDate(date: Date): string {
  return `${WD[date.getDay()]}, ${date.getDate()} ${MO[date.getMonth()]} ${date.getFullYear()}`;
}

export function shortDate(date: Date): string {
  return `${date.getDate()} ${MO[date.getMonth()]}`;
}

/** done | overdue (expired by deadline or past its day) | pending */
export function taskState(t: Task): TaskState {
  if (t.done) return "done";
  const overByDeadline = !!t.deadline && parseIso(t.deadline) < TODAY;
  const overByDay = parseIso(t.date) < TODAY;
  return overByDeadline || overByDay ? "overdue" : "pending";
}

/** Hierarchy for a day's dot: overdue (red) > pending (yellow) > done (green) > null */
export function dayStatus(tasksOnDay: Task[]): DayStatus {
  if (!tasksOnDay || !tasksOnDay.length) return null;
  if (tasksOnDay.some((t) => taskState(t) === "overdue")) return "overdue";
  if (tasksOnDay.some((t) => !t.done)) return "pending";
  return "done";
}

export function initials(name: string): string {
  if (name === "Você") return "VC";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

let _idc = 100;
export const uid = (p: string): string => `${p}_${++_idc}`;

export const STATE_COLOR: Record<TaskState, string> = {
  overdue: "var(--overdue)",
  pending: "var(--p-amber)",
  done: "var(--p-green)",
};
export const STATE_LABEL: Record<TaskState, string> = {
  overdue: "Atrasada",
  pending: "Pendente",
  done: "Concluída",
};
