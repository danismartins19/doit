"use client";

import { apiRequest } from "../api-client";
import type { TaskResponse, TaskStatus } from "../types";

export interface TaskPayload {
  title: string;
  description?: string;
  details?: string;
  day: string;
  deadline?: string | null;
  responsibleId?: string | null;
  status?: TaskStatus;
  order?: number;
}

export function useTasksHook() {
  return {
    listTasks: (projectId: string, status?: TaskStatus) =>
      apiRequest<TaskResponse[]>(`/projects/${projectId}/tasks`, { query: { status } }),
    createTask: (projectId: string, data: TaskPayload) =>
      apiRequest<TaskResponse>(`/projects/${projectId}/tasks`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getTask: (taskId: string) => apiRequest<TaskResponse>(`/tasks/${taskId}`),
    updateTask: (taskId: string, data: Partial<TaskPayload>) =>
      apiRequest<TaskResponse>(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteTask: (taskId: string) =>
      apiRequest<{ ok: boolean }>(`/tasks/${taskId}`, { method: "DELETE" }),
    moveTask: (taskId: string, data: { day: string; order?: number }) =>
      apiRequest<TaskResponse>(`/tasks/${taskId}/move`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    updateStatus: (taskId: string, status: TaskStatus) =>
      apiRequest<TaskResponse>(`/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    updateResponsible: (taskId: string, responsibleId: string | null) =>
      apiRequest<TaskResponse>(`/tasks/${taskId}/responsible`, {
        method: "PATCH",
        body: JSON.stringify({ responsibleId }),
      }),
  };
}
