"use client";

import { apiRequest } from "../api-client";
import type { UserResponse } from "../types";

export function useUsersHook() {
  return {
    getProfile: () => apiRequest<UserResponse>("/users/me"),
    updateProfile: (data: { name?: string; calendarSyncEnabled?: boolean }) =>
      apiRequest<UserResponse>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  };
}
