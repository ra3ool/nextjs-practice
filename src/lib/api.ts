const API_URL = process.env.API_URL ?? 'http://localhost:4000';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  tags?: string[]; // for cache invalidation
  revalidate?: number; // ISR in seconds
  cache?: RequestCache; // 'force-cache' | 'no-store'
};

export async function apiFetch<T>(
  path: string,
  { method = 'GET', body, tags, revalidate, cache }: FetchOptions = {},
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      cache,
      next: { revalidate, tags },
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    return res.json();
  } catch (error) {
    return null;
  }
}
