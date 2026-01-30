const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

// export function getToken() {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('accessToken');
// }

// export function setToken(token: string) {
//   localStorage.setItem('accessToken', token);
// }

let token: string | null = null;

export function setToken(t: string, user?: any) {
  token = t;
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', t);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}

export function getToken() {
  if (token) return token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }
  return token;
}


export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as any),
  };

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (!headers['Content-Type'] && options.body && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = data?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
  }

  return data;
}

export function clearToken() {
  localStorage.removeItem('accessToken');
}

export function isLoggedIn() {
  return !!getToken();
}
