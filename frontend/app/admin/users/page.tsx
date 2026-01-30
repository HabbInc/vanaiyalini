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

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.roles.join(', ')}</td>
                <td>{u.status || 'active'}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteUser(u._id, u.roles)}
                    className="text-red-600 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
