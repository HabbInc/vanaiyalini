export type StoredUser = {
  _id?: string;
  name?: string;
  email?: string;
  roles?: string[];
};

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAdminUser(): boolean {
  const u = getStoredUser();
  return Array.isArray(u?.roles) && u!.roles!.includes('admin');
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}
