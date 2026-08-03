// Thin client for the .NET gateway. Sends the HttpOnly session cookie with every request.
// TODO: generate types from the backend OpenAPI spec; add TanStack Query hooks.
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function api(path: string, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, { credentials: "include", ...init });
}
