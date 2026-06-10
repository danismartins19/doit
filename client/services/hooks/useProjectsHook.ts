"use client";

import { apiRequest } from "../api-client";
import type { CalendarSyncMode, ProjectMemberResponse, ProjectResponse } from "../types";

export function useProjectsHook() {
  return {
    listProjects: () => apiRequest<ProjectResponse[]>("/projects"),
    createProject: (data: { name: string; color: string }) =>
      apiRequest<ProjectResponse>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getProject: (projectId: string) => apiRequest<ProjectResponse>(`/projects/${projectId}`),
    updateProject: (projectId: string, data: { name?: string; color?: string }) =>
      apiRequest<ProjectResponse>(`/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteProject: (projectId: string) =>
      apiRequest<{ ok: boolean }>(`/projects/${projectId}`, { method: "DELETE" }),
    listMembers: (projectId: string) =>
      apiRequest<ProjectMemberResponse[]>(`/projects/${projectId}/members`),
    updateMember: (projectId: string, memberId: string, calendarSyncMode: CalendarSyncMode) =>
      apiRequest<ProjectMemberResponse>(`/projects/${projectId}/members/${memberId}`, {
        method: "PATCH",
        body: JSON.stringify({ calendarSyncMode }),
      }),
    removeMember: (projectId: string, memberId: string) =>
      apiRequest<{ ok: boolean }>(`/projects/${projectId}/members/${memberId}`, {
        method: "DELETE",
      }),
  };
}
