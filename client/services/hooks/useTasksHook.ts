"use client";

import { useCallback, useMemo } from "react";
import {
  CreateTaskDto,
  MoveTaskDto,
  TasksApi,
  TasksControllerListStatusEnum,
  UpdateTaskResponsibleDto,
  UpdateTaskStatusDto,
} from "../api-back";
import "../api";

export function useTasksHook() {
  const tasksApi = useMemo(() => new TasksApi(), []);

  const create = useCallback(
    async (projectId: string, createTaskDto: CreateTaskDto) => {
      return tasksApi.tasksControllerCreate(projectId, createTaskDto);
    },
    [tasksApi],
  );

  const findAll = useCallback(
    async (projectId: string, status?: TasksControllerListStatusEnum) => {
      return tasksApi.tasksControllerList(projectId, status);
    },
    [tasksApi],
  );

  const findOne = useCallback(
    async (taskId: string) => {
      return tasksApi.tasksControllerGet(taskId);
    },
    [tasksApi],
  );

  const update = useCallback(
    async (taskId: string, updateTaskDto: Partial<CreateTaskDto>) => {
      return tasksApi.tasksControllerUpdate(taskId, updateTaskDto);
    },
    [tasksApi],
  );

  const remove = useCallback(
    async (taskId: string) => {
      return tasksApi.tasksControllerDelete(taskId);
    },
    [tasksApi],
  );

  const move = useCallback(
    async (taskId: string, moveTaskDto: MoveTaskDto) => {
      return tasksApi.tasksControllerMove(taskId, moveTaskDto);
    },
    [tasksApi],
  );

  const updateStatus = useCallback(
    async (taskId: string, updateTaskStatusDto: UpdateTaskStatusDto) => {
      return tasksApi.tasksControllerStatus(taskId, updateTaskStatusDto);
    },
    [tasksApi],
  );

  const updateResponsible = useCallback(
    async (taskId: string, updateTaskResponsibleDto: UpdateTaskResponsibleDto) => {
      return tasksApi.tasksControllerResponsible(taskId, updateTaskResponsibleDto);
    },
    [tasksApi],
  );

  return {
    create,
    findAll,
    findOne,
    update,
    remove,
    move,
    updateStatus,
    updateResponsible,
  };
}
