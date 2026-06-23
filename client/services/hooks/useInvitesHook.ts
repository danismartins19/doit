"use client";

import { useCallback, useMemo } from "react";
import { AcceptInviteDto, CreateInviteDto, InvitesApi } from "../api-back";
import "../api";

export function useInvitesHook() {
  const invitesApi = useMemo(() => new InvitesApi(), []);

  const create = useCallback(
    async (projectId: string, createInviteDto: CreateInviteDto) => {
      return invitesApi.invitesControllerCreate(projectId, createInviteDto);
    },
    [invitesApi],
  );

  const findOne = useCallback(
    async (tokenInvite: string) => {
      return invitesApi.invitesControllerGet(tokenInvite);
    },
    [invitesApi],
  );

  const accept = useCallback(
    async (tokenInvite: string, acceptInviteDto: AcceptInviteDto) => {
      return invitesApi.invitesControllerAccept(tokenInvite, acceptInviteDto);
    },
    [invitesApi],
  );

  const decline = useCallback(
    async (tokenInvite: string) => {
      return invitesApi.invitesControllerDecline(tokenInvite);
    },
    [invitesApi],
  );

  return {
    create,
    findOne,
    accept,
    decline,
  };
}
