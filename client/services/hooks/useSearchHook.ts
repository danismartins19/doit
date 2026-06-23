"use client";

import { useCallback, useMemo } from "react";
import { SearchApi } from "../api-back";
import "../api";

export function useSearchHook() {
  const searchApi = useMemo(() => new SearchApi(), []);

  const tasks = useCallback(
    async (q: string) => {
      return searchApi.searchControllerTasks(q);
    },
    [searchApi],
  );

  return {
    tasks,
  };
}
