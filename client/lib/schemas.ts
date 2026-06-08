/* ============ doit — zod schemas (react-hook-form) ============ */
import { z } from "zod";

export const PROJECT_COLORS = [
  "#3d7ff5",
  "#8b5cf6",
  "#1f9d63",
  "#e0901a",
  "#e5557a",
  "#0ea5b7",
] as const;

/** Inline quick-add + full task editing */
export const taskSchema = z.object({
  title: z.string().trim().min(1, "Informe um título").max(160, "Título muito longo"),
  deadline: z.string().nullable().optional(),
  notes: z.string().max(2000).optional(),
});
export type TaskFormValues = z.infer<typeof taskSchema>;

export const newProjectSchema = z.object({
  name: z.string().trim().min(1, "Dê um nome ao projeto").max(40, "Nome muito longo"),
  color: z.enum(PROJECT_COLORS),
});
export type NewProjectValues = z.infer<typeof newProjectSchema>;

export const inviteSchema = z.object({
  email: z.string().trim().min(1, "Informe um e-mail").email("E-mail inválido"),
  role: z.enum(["view", "edit"]),
});
export type InviteValues = z.infer<typeof inviteSchema>;
