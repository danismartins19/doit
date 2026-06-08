/* ============ doit — domain types ============ */

export interface Person {
  id: string;
  name: string;
  email: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  /** CSS var reference, e.g. "var(--p-blue)" */
  color: string;
  /** raw hex, used for inline backgrounds */
  raw: string;
  members: string[];
  shareLink: string;
}

export interface Task {
  id: string;
  projectId: string;
  /** ISO date (yyyy-mm-dd) of the day this task lives on */
  date: string;
  title: string;
  done: boolean;
  /** ISO date deadline, or null */
  deadline: string | null;
  /** person id of the assignee/author */
  by: string;
  notes: string;
}

export type TaskState = "done" | "overdue" | "pending";
export type DayStatus = TaskState | null;

export type ActivityKind =
  | "complete"
  | "reopen"
  | "add"
  | "deadline"
  | "edit"
  | "delete"
  | "join"
  | "create";

export interface Activity {
  id: string;
  projectId: string;
  by: string;
  kind: ActivityKind;
  target: string | null;
  date: string;
  time: string;
}

export type Role = "view" | "edit";
