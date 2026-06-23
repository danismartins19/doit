"use client";

import { useCallback, useMemo } from "react";
import { AuthApi, UpdateCalendarPreferenceDto } from "../api-back";
import { apiBasePath } from "../api";

export function useAuthHook() {
  const authApi = useMemo(() => new AuthApi(), []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = `${apiBasePath}/auth/google`;
  }, []);

  const me = useCallback(async () => {
    return authApi.authControllerMe();
  }, [authApi]);

  const logout = useCallback(async () => {
    return authApi.authControllerLogout();
  }, [authApi]);

  const updateCalendarPreference = useCallback(
    async (updateCalendarPreferenceDto: UpdateCalendarPreferenceDto) => {
      return authApi.authControllerUpdateCalendarPreference(updateCalendarPreferenceDto);
    },
    [authApi],
  );

  return {
    loginWithGoogle,
    me,
    logout,
    updateCalendarPreference,
  };
}
