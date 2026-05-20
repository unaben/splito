/**
 * store.ts
 * ─────────────────────────────────────────────────────────────
 * TODO - SWAP GUIDE (future → Supabase):
 *   Replace fetch() calls with supabase client calls.
 *   Keep the same function signatures so callers stay unchanged.
 * ─────────────────────────────────────────────────────────────
 */

import type { User, Group } from "@/types";
import { fetchApi } from "./fetchApi";

export async function getUser(id: string): Promise<User | undefined> {
  try {
    return await fetchApi<User>(`/api/users/${id}`);
  } catch {
    return undefined;
  }
}

export async function getUsersByIds(ids: string[]): Promise<User[]> {
  if (ids.length === 0) return [];
  return fetchApi<User[]>(`/api/users?ids=${ids.join(",")}`);
}

export async function getAllUsers(): Promise<User[]> {
  return fetchApi<User[]>("/api/users");
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  return fetchApi<User>("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: string,
  data: Partial<
    Pick<User, "name" | "email" | "avatarInitials" | "avatarBg" | "avatarFg">
  >
): Promise<User | undefined> {
  try {
    return await fetchApi<User>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return undefined;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await fetchApi<{ deleted: boolean }>(`/api/users/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
}

// ─── Group queries ────────────────────────────────────────────────────────────

export async function getGroups(userId: string): Promise<Group[]> {
  return fetchApi<Group[]>(`/api/groups?userId=${userId}`);
}

export async function getGroup(id: string): Promise<Group | undefined> {
  try {
    return await fetchApi<Group>(`/api/groups/${id}`);
  } catch {
    return undefined;
  }
}

export async function createGroup(data: {
  name: string;
  description?: string;
  emoji: string;
  createdBy: string;
  memberIds: string[];
}): Promise<Group> {
  return fetchApi<Group>("/api/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateGroup(
  id: string,
  data: Partial<Pick<Group, "name" | "description" | "emoji" | "memberIds">>
): Promise<Group | undefined> {
  try {
    return await fetchApi<Group>(`/api/groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return undefined;
  }
}

export async function deleteGroup(id: string): Promise<boolean> {
  try {
    await fetchApi<{ deleted: boolean }>(`/api/groups/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
}


