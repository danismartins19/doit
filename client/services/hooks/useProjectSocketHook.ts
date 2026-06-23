"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { apiBasePath } from "../api";
import type { TaskResponseDto } from "../api-back";
import { getSession } from "next-auth/react";

export interface ProjectPresenceUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface ProjectTaskChangedEvent {
  action: "created" | "updated" | "deleted" | "moved" | "status-changed" | "responsible-changed";
  projectId: string;
  taskId: string;
  task?: TaskResponseDto;
  actor: ProjectPresenceUser;
}

interface UseProjectSocketOptions {
  projectId?: string | null;
  token?: string;
  onTaskChanged?: (event: ProjectTaskChangedEvent) => void;
}

export function useProjectSocketHook({ projectId, token, onTaskChanged }: UseProjectSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const onTaskChangedRef = useRef(onTaskChanged);
  const [isConnected, setIsConnected] = useState(false);
  const [presence, setPresence] = useState<ProjectPresenceUser[]>([]);

  onTaskChangedRef.current = onTaskChanged;

  const connect = useCallback(async () => {
    if (socketRef.current?.connected) {
      return socketRef.current;
    }

    const session = await getSession();
    const resolvedToken = token ?? session?.accessToken;
    const socket = io(apiBasePath, {
      withCredentials: true,
      auth: resolvedToken ? { token: resolvedToken } : undefined,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => {
      setIsConnected(false);
      setPresence([]);
    });
    socket.on("project:presence", (event: { projectId: string; users: ProjectPresenceUser[] }) => {
      if (!projectId || event.projectId === projectId) {
        setPresence(event.users);
      }
    });
    socket.on("task:changed", (event: ProjectTaskChangedEvent) => {
      onTaskChangedRef.current?.(event);
    });

    socketRef.current = socket;
    return socket;
  }, [projectId, token]);

  const joinProject = useCallback(
    async (nextProjectId = projectId) => {
      if (!nextProjectId) {
        return;
      }

      const socket = await connect();
      socket.emit("project:join", { projectId: nextProjectId });
    },
    [connect, projectId],
  );

  const leaveProject = useCallback(
    (nextProjectId = projectId) => {
      if (!nextProjectId) {
        return;
      }

      socketRef.current?.emit("project:leave", { projectId: nextProjectId });
      setPresence([]);
    },
    [projectId],
  );

  useEffect(() => {
    if (!projectId) {
      return;
    }

    joinProject(projectId);

    return () => {
      leaveProject(projectId);
    };
  }, [joinProject, leaveProject, projectId]);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return useMemo(
    () => ({
      socket: socketRef.current,
      isConnected,
      presence,
      joinProject,
      leaveProject,
    }),
    [isConnected, joinProject, leaveProject, presence],
  );
}
