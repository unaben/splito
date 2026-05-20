import { baseUrl } from "./baseUrl";

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
    const url = path.startsWith("http") ? path : `${baseUrl()}${path}`;    
  
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });    
  
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error((err as { error: string }).error ?? "API error");
    }
  
    return res.json() as Promise<T>;
  }