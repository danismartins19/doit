"use client";

import * as React from "react";
import type { ProjectResponseDto, TaskResponseDto, UserResponseDto } from "@/services/api-back";
import type { Activity } from "./types";

interface State {
  user: UserResponseDto | null;
  projects: ProjectResponseDto[];
  tasks: TaskResponseDto[];
  activity: Activity[];
  currentId: string;
  loading: boolean;
  error: string | null;
}

interface StoreValue extends State {
  people: Record<string, UserResponseDto>;
  current: ProjectResponseDto | null;
  setUser: (user: UserResponseDto | null) => void;
  setProjects: (projects: ProjectResponseDto[]) => void;
  setTasks: (tasks: TaskResponseDto[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectProject: (id: string) => void;
  upsertProject: (project: ProjectResponseDto) => void;
  upsertTask: (task: TaskResponseDto) => void;
  removeTask: (id: string) => void;
}

const StoreContext = React.createContext<StoreValue | null>(null);

const initialState: State = {
  user: null,
  projects: [],
  tasks: [],
  activity: [],
  currentId: "",
  loading: true,
  error: null,
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(initialState);

  const setUser = React.useCallback((user: UserResponseDto | null) => {
    setState((current) => ({ ...current, user }));
  }, []);

  const setProjects = React.useCallback((projects: ProjectResponseDto[]) => {
    setState((current) => ({
      ...current,
      projects,
      currentId:
        current.currentId && projects.some((project) => project.id === current.currentId)
          ? current.currentId
          : projects[0]?.id ?? "",
    }));
  }, []);

  const setTasks = React.useCallback((tasks: TaskResponseDto[]) => {
    setState((current) => ({ ...current, tasks }));
  }, []);

  const setLoading = React.useCallback((loading: boolean) => {
    setState((current) => ({ ...current, loading }));
  }, []);

  const setError = React.useCallback((error: string | null) => {
    setState((current) => ({ ...current, error }));
  }, []);

  const selectProject = React.useCallback((id: string) => {
    setState((current) => ({ ...current, currentId: id }));
  }, []);

  const upsertProject = React.useCallback((project: ProjectResponseDto) => {
    setState((current) => ({
      ...current,
      projects: current.projects.some((item) => item.id === project.id)
        ? current.projects.map((item) => (item.id === project.id ? project : item))
        : [project, ...current.projects],
      currentId: project.id,
    }));
  }, []);

  const upsertTask = React.useCallback((task: TaskResponseDto) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.some((item) => item.id === task.id)
        ? current.tasks.map((item) => (item.id === task.id ? task : item))
        : [...current.tasks, task],
    }));
  }, []);

  const removeTask = React.useCallback((id: string) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
    }));
  }, []);

  const people = React.useMemo(() => {
    const users: Record<string, UserResponseDto> = {};
    if (state.user) {
      users[state.user.id] = state.user;
    }

    state.projects.forEach((project) => {
      project.owner && (users[project.owner.id] = project.owner);
      project.members?.forEach((member) => {
        member.user && (users[member.user.id] = member.user);
      });
    });

    state.tasks.forEach((task) => {
      task.createdBy && (users[task.createdBy.id] = task.createdBy);
      task.responsible && (users[task.responsible.id] = task.responsible);
    });

    return users;
  }, [state.projects, state.tasks, state.user]);

  const value = React.useMemo<StoreValue>(() => {
    const current = state.projects.find((project) => project.id === state.currentId) ?? null;

    return {
      ...state,
      people,
      current,
      setUser,
      setProjects,
      setTasks,
      setLoading,
      setError,
      selectProject,
      upsertProject,
      upsertTask,
      removeTask,
    };
  }, [
    people,
    removeTask,
    selectProject,
    setError,
    setLoading,
    setProjects,
    setTasks,
    setUser,
    state,
    upsertProject,
    upsertTask,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
