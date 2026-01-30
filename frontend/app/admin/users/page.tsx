'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const data = await apiFetch('/admin/users');
      setUsers(data);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteUser(id: string, roles: string[]) {
    if (roles.includes('admin')) {
      alert("Can't delete admin user");
      return;
    }
    if (!confirm('Delete this user?')) return;

    try {
      await apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      {err && <div className="text-red-600">{err}</div>}

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Users</h2>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="text-sm underline"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto border rounded-xl bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Roles</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.roles?.join(', ')}</td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        (u.status || 'active') === 'blocked'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {u.status || 'active'}
                    </span>
                  </td>

                  <td className="p-2">
                    {(u.status || 'active') === 'blocked' ? (
                      <button
                        className="text-sm underline"
                        onClick={async () => {
                          try {
                            await apiFetch(`/admin/users/${u._id}/unblock`, { method: 'PATCH' });
                            setUsers((prev) =>
                              prev.map((x) =>
                                x._id === u._id ? { ...x, status: 'active' } : x
                              )
                            );
                          } catch (e: any) {
                            alert(e.message);
                          }
                        }}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="text-sm underline text-red-600"
                        onClick={async () => {
                          if (!confirm('Block this user? They cannot login after blocking.')) return;

                          try {
                            await apiFetch(`/admin/users/${u._id}/block`, { method: 'PATCH' });
                            setUsers((prev) =>
                              prev.map((x) =>
                                x._id === u._id ? { ...x, status: 'blocked' } : x
                              )
                            );
                          } catch (e: any) {
                            alert(e.message);
                          }
                        }}
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
