export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: string[];
  readonly path?: string;

  constructor(params: { status: number; code?: string; message: string; details?: string[]; path?: string }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.path = params.path;
  }

  toString() {
    const base = `HTTP ${this.status}${this.code ? ' ' + this.code : ''}: ${this.message}`;
    const det = this.details && this.details.length ? `\n- ${this.details.join('\n- ')}` : '';
    return base + det;
  }
}

export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const token = sessionStorage.getItem('idToken');
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    headers,
    ...init,
  });

  const text = await res.text().catch(() => '');
  const isJson = (res.headers.get('content-type') || '').includes('application/json');

  if (!res.ok) {
    if (isJson) {
      try {
        const parsed = JSON.parse(text) as {
          timestamp?: string;
          path?: string;
          status?: number;
          code?: string;
          message?: string;
          details?: string[];
        };
        throw new ApiError({
          status: parsed.status ?? res.status,
          code: parsed.code,
          message: parsed.message ?? res.statusText,
          details: parsed.details,
          path: parsed.path,
        });
      } catch {
        const body = (text || '').trim();
        const snippet = body ? body.slice(0, 500) : '';
        throw new ApiError({
          status: res.status,
          code: 'NON_JSON_ERROR',
          message: snippet || res.statusText,
          details: snippet ? [snippet] : undefined,
          path: undefined,
        });
      }
    }
    throw new ApiError({ status: res.status, message: `${res.statusText}: ${text}` });
  }

  if (!text) {
    return undefined as unknown as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as unknown as T;
  }
}
