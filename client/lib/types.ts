import type {
  ProjectMemberResponseDto,
  ProjectResponseDto,
  TaskResponseDto,
  UserResponseDto,
} from "@/services/api-back";

export type Person = UserResponseDto;
export type Project = ProjectResponseDto;
export type ProjectMember = ProjectMemberResponseDto;
export type Task = TaskResponseDto;

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
