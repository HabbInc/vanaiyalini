'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loadingSeller, setLoadingSeller] = useState(false);

  async function load() {
    try {
      const u = await apiFetch('/users/profile');
      setUser(u);
    } catch (e: any) {
      setErr(e.message);
      router.push('/login');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function becomeSeller() {
    setMsg(null);
    setLoadingSeller(true);
    try {
      await apiFetch('/users/become-seller', { method: 'PATCH' });
      setMsg('You are now a seller ✅ Please login again to refresh token roles.');
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoadingSeller(false);
    }
  }

  if (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {err}
      </div>
    );
  }

  if (!user) return <div className="text-gray-600">Loading...</div>;

  const roles: string[] = user.roles ?? [];
  const isSeller = roles.includes('seller');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-gray-600 mt-1">Your account details & roles.</p>
        </div>
        <a href="/products" className="text-sm hover:underline">
          ← Back to products
        </a>
      </header>

      {msg && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {msg}
        </div>
      )}

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-gray-600">Name</div>
            <div className="font-semibold">{user.name}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Email</div>
            <div className="font-semibold">{user.email}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Status</div>
            <div className="font-semibold">{user.status ?? 'active'}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Roles</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {roles.map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {!isSeller ? (
            <button
              onClick={becomeSeller}
              disabled={loadingSeller}
              className="rounded-lg bg-black text-white px-4 py-2 font-medium disabled:opacity-50"
            >
              {loadingSeller ? 'Updating...' : 'Become Seller'}
            </button>
          ) : (
            <a
              href="/products"
              className="rounded-lg border bg-white px-4 py-2 font-medium hover:bg-gray-50"
            >
              Seller Active ✅
            </a>
          )}

          <a
            href="/orders"
            className="rounded-lg border bg-white px-4 py-2 font-medium hover:bg-gray-50"
          >
            View Orders
          </a>

          <a
            href="/cart"
            className="rounded-lg border bg-white px-4 py-2 font-medium hover:bg-gray-50"
          >
            View Cart
          </a>
        </div>

        <p className="text-xs text-gray-500">
          Note: after “Become Seller”, login again to get a token containing seller role.
        </p>
      </div>
    </div>
  );
}
