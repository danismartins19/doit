"use client";

import { apiRequest } from "../api-client";
import type { TaskResponse } from "../types";

export function useSearchHook() {
  return {
    searchTasks: (q: string) => apiRequest<TaskResponse[]>("/search/tasks", { query: { q } }),
  };
}
