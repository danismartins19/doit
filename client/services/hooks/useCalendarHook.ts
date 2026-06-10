"use client";

import { useAuthHook } from "./useAuthHook";
import { useProjectsHook } from "./useProjectsHook";

export function useCalendarHook() {
  const auth = useAuthHook();
  const projects = useProjectsHook();

  return {
    updateGlobalPreference: auth.updateCalendarPreference,
    updateProjectPreference: projects.updateMember,
  };
}
