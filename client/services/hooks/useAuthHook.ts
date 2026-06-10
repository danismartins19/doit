"use client";

import { apiBaseUrl, apiRequest } from "../api-client";
import type { UserResponse } from "../types";

export function useAuthHook() {
  return {
    getMe: () => apiRequest<UserResponse>("/auth/me"),
    logout: () => apiRequest<{ ok: boolean }>("/auth/logout", { method: "POST" }),
    loginWithGoogle: () => {
      window.location.href = `${apiBaseUrl}/auth/google`;
    },
    updateCalendarPreference: (calendarSyncEnabled: boolean) =>
      apiRequest<UserResponse>("/auth/me/calendar-preferences", {
        method: "PATCH",
        body: JSON.stringify({ calendarSyncEnabled }),
      }),
  };
}
