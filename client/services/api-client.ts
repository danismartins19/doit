"use client";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type ApiOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined | null>;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = new URL(path, apiBaseUrl);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? "API request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function jsonBody(value: unknown) {
  return JSON.stringify(value);
}
