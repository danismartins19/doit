"use client";

import { useCallback } from "react";
import { UpdateCalendarPreferenceDto, UpdateProjectMemberDto } from "../api-back";
import { useAuthHook } from "./useAuthHook";
import { useProjectsHook } from "./useProjectsHook";

export function useCalendarHook() {
  const auth = useAuthHook();
  const projects = useProjectsHook();

  const updateGlobalPreference = useCallback(
    async (updateCalendarPreferenceDto: UpdateCalendarPreferenceDto) => {
      return auth.updateCalendarPreference(updateCalendarPreferenceDto);
    },
    [auth],
  );

  const updateProjectPreference = useCallback(
    async (projectId: string, memberId: string, updateProjectMemberDto: UpdateProjectMemberDto) => {
      return projects.updateMember(projectId, memberId, updateProjectMemberDto);
    },
    [projects],
  );

  return {
    updateGlobalPreference,
    updateProjectPreference,
  };
}
