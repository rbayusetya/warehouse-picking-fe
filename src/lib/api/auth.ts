import type { User } from "../types";
import { request, mapUser } from "./request";
import type { RawLoginResponse, RawUserResponse } from "./response-types";

export async function apiLogin(username: string, password: string): Promise<User> {
  // Backend sets httpOnly cookie via Set-Cookie header on success.
  // Frontend never touches the token directly.
  const data = await request<RawLoginResponse>("POST", "/api/auth/login", { username, password });
  return mapUser(data);
}

export async function apiFetchMe(): Promise<User | null> {
  try {
    // Backend reads the httpOnly cookie and returns the current user.
    const data = await request<RawUserResponse>("GET", "/api/auth/me");
    return mapUser(data);
  } catch {
    return null;
  }
}

export async function apiLogout(): Promise<void> {
  // Backend clears the httpOnly cookie via Set-Cookie header.
  await request("POST", "/api/auth/logout").catch(() => {
    // Ignore errors — cookie may already be cleared
  });
}
