"use client";

import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const apiBasePath = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

axios.defaults.baseURL = apiBasePath;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const api = axios.create({
  baseURL: apiBasePath,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

function attachAuthInterceptors(instance: typeof axios | typeof api) {
  instance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      signOut({ callbackUrl: "/auth/login" });
    }

    return Promise.reject(error);
  },
  );
}

attachAuthInterceptors(axios);
attachAuthInterceptors(api);
