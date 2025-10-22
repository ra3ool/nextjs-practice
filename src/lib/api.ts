type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  tags?: string[]; // for cache invalidation
  revalidate?: number; // ISR in seconds
  cache?: RequestCache; // 'force-cache' | 'no-store'
};

function createApiClient(baseURL?: string) {
  const API_URL =
    baseURL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

  return async function apiFetch<T>(
    path: string,
    { method = 'GET', body, tags, revalidate, cache }: FetchOptions = {},
  ): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      cache,
      next: { revalidate, tags },
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${await res.text()}`);
    }

    return res.json() as Promise<T>;
  };
}

const defaultApi = createApiClient();

const userApi = createApiClient('https://63c2988fe3abfa59bdaf89f6.mockapi.io');

export { createApiClient, defaultApi, userApi };
