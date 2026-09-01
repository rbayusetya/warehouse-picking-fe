import type { User } from "../types";
import { request, mapUser, setAuthCookie, clearAuthCookie } from "./request";
import type { RawLoginResponse, RawUserResponse } from "./response-types";

export async function apiLogin(username: string, password: string): Promise<User> {
  const data = await request<RawLoginResponse>("POST", "/api/auth/login", { username, password });
  localStorage.setItem("auth_token", data.access_token);
  setAuthCookie(data.access_token);
  const user = mapUser(data);
  localStorage.setItem("auth_user", JSON.stringify(user));
  return user;
}

export async function apiFetchMe(): Promise<User | null> {
  try {
    const data = await request<RawUserResponse>("GET", "/api/auth/me");
    return mapUser(data);
  } catch {
    return null;
  }
}

export function apiLogout(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  clearAuthCookie();
}
