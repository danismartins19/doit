"use client";

import { useCallback, useMemo } from "react";
import { UpdateUserDto, UsersApi } from "../api-back";
import "../api";

export function useUsersHook() {
  const usersApi = useMemo(() => new UsersApi(), []);

  const me = useCallback(async () => {
    return usersApi.usersControllerMe();
  }, [usersApi]);

  const updateMe = useCallback(
    async (updateUserDto: UpdateUserDto) => {
      return usersApi.usersControllerUpdateMe(updateUserDto);
    },
    [usersApi],
  );

  return {
    me,
    updateMe,
  };
}
