"use client";

import { useCallback, useMemo } from "react";
import {
  CreateProjectDto,
  ProjectsApi,
  UpdateProjectMemberDto,
} from "../api-back";
import "../api";

export function useProjectsHook() {
  const projectsApi = useMemo(() => new ProjectsApi(), []);

  const create = useCallback(
    async (createProjectDto: CreateProjectDto) => {
      return projectsApi.projectsControllerCreate(createProjectDto);
    },
    [projectsApi],
  );

  const findAll = useCallback(async () => {
    return projectsApi.projectsControllerList();
  }, [projectsApi]);

  const findOne = useCallback(
    async (projectId: string) => {
      return projectsApi.projectsControllerGet(projectId);
    },
    [projectsApi],
  );

  const update = useCallback(
    async (projectId: string, updateProjectDto: Partial<CreateProjectDto>) => {
      return projectsApi.projectsControllerUpdate(projectId, updateProjectDto);
    },
    [projectsApi],
  );

  const remove = useCallback(
    async (projectId: string) => {
      return projectsApi.projectsControllerDelete(projectId);
    },
    [projectsApi],
  );

  const members = useCallback(
    async (projectId: string) => {
      return projectsApi.projectsControllerMembers(projectId);
    },
    [projectsApi],
  );

  const updateMember = useCallback(
    async (projectId: string, memberId: string, updateProjectMemberDto: UpdateProjectMemberDto) => {
      return projectsApi.projectsControllerUpdateMember(projectId, memberId, updateProjectMemberDto);
    },
    [projectsApi],
  );

  const removeMember = useCallback(
    async (projectId: string, memberId: string) => {
      return projectsApi.projectsControllerRemoveMember(projectId, memberId);
    },
    [projectsApi],
  );

  return {
    create,
    findAll,
    findOne,
    update,
    remove,
    members,
    updateMember,
    removeMember,
  };
}
