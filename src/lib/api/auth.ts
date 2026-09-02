import type { User } from "../types";
import { request, mapUser, setToken, clearToken } from "./request";
import type { RawLoginResponse, RawUserResponse } from "./response-types";

export async function apiLogin(username: string, password: string): Promise<User> {
  const data = await request<RawLoginResponse>("POST", "/api/auth/login", { username, password });
  // Backend returns the JWT in the JSON body. Store it for future requests.
  if (data.access_token) {
    setToken(data.access_token);
  }
  return mapUser(data);
}

export async function apiFetchMe(): Promise<User | null> {
  try {
    const data = await request<RawUserResponse>("GET", "/api/auth/me");
    return mapUser(data);
  } catch {
    // Token expired or invalid — clear it
    clearToken();
    return null;
  }
}

export async function apiLogout(): Promise<void> {
  // Clear token locally. The backend doesn't have a logout endpoint yet.
  clearToken();
}
