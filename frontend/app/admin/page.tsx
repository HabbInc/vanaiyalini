'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [u, o, s] = await Promise.all([
          apiFetch('/admin/users'),
          apiFetch('/admin/orders'),
          apiFetch('/admin/summary'),
        ]);
        setUsers(u);
        setOrders(o);
        setSummary(s);
      } catch (e: any) {
        setErr(e.message);
        router.push('/products');
      }
    }
    load();
  }, [router]);

  if (err) {
    return (
      <div className="text-red-600">
        {err} (Admins only)
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* SUMMARY */}
      {summary && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-5">
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-2xl font-bold">{summary.totalUsers}</div>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-2xl font-bold">{summary.totalOrders}</div>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <div className="text-sm text-gray-600">Revenue</div>
            <div className="text-2xl font-bold">LKR {summary.totalRevenue}</div>
          </div>
        </div>
      )}

      {/* USERS */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Users</h2>
            <p className="text-gray-600 text-sm">Block users to prevent login</p>
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


      {/* ORDERS */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Orders</h2>
            <p className="text-gray-600 text-sm">Admin can update order status</p>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-xl bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Order ID</th>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-2 font-mono">{o._id}</td>
                  <td className="p-2">{o.userId?.email || 'N/A'}</td>
                  <td className="p-2">LKR {o.totalAmount}</td>

                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={o.status}
                      onChange={(e) => {
                        const status = e.target.value;
                        setOrders((prev) =>
                          prev.map((x) =>
                            x._id === o._id ? { ...x, status } : x
                          )
                        );
                      }}
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>

                  <td className="p-2">
                    <button
                      className="underline text-blue-600"
                      onClick={async () => {
                        try {
                          await apiFetch(`/admin/orders/${o._id}/status`, {
                            method: 'PATCH',
                            body: JSON.stringify({ status: o.status }),
                          });
                          alert('Updated ✅');
                        } catch (e: any) {
                          alert(e.message);
                        }
                      }}
                    >
                      Save
                    </button>
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
