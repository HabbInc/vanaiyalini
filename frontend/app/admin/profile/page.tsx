'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  // Optional: password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/admin/me');
        setMe(data);
      } catch (e: any) {
        setErr(e.message);
        router.push('/products');
      }
    }
    load();
  }, [router]);

  // (Optional) password change - only if you implement backend endpoint
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);

    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      setMsg('Password updated ✅');
      setOldPassword('');
      setNewPassword('');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!me && !err) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <p className="text-gray-600 mt-1">Your admin account details</p>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}

      {msg && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {msg}
        </div>
      )}

      {/* Profile Card */}
      {me && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-3">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-semibold">{me.name}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-semibold">{me.email}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Roles</div>
              <div className="font-semibold">{me.roles?.join(', ')}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-semibold">{me.status || 'active'}</div>
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm text-gray-500">Created At</div>
              <div className="font-semibold">
                {me.createdAt ? new Date(me.createdAt).toLocaleString() : '-'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optional: Change Password Section */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <form onSubmit={changePassword} className="space-y-3">
          <input
            className="w-full rounded-lg border p-2"
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            className="w-full rounded-lg border p-2"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            disabled={saving}
            className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="text-xs text-gray-500">
          Note: Password change works only if backend route <code>/auth/change-password</code> exists.
        </p>
      </div>
    </div>
  );
}
