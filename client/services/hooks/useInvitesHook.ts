"use client";

import { apiRequest } from "../api-client";
import type { CalendarSyncMode, InviteResponse, ProjectResponse } from "../types";

export function useInvitesHook() {
  return {
    createInvite: (projectId: string, data: { email?: string; expiresInDays?: number }) =>
      apiRequest<InviteResponse>(`/projects/${projectId}/invites`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getInvite: (token: string) => apiRequest<InviteResponse>(`/invites/${token}`),
    acceptInvite: (token: string, calendarSyncMode: CalendarSyncMode) =>
      apiRequest<ProjectResponse>(`/invites/${token}/accept`, {
        method: "POST",
        body: JSON.stringify({ calendarSyncMode }),
      }),
    declineInvite: (token: string) =>
      apiRequest<{ ok: boolean }>(`/invites/${token}/decline`, { method: "POST" }),
  };
}
