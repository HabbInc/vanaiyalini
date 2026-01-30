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
      <section>
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.roles.join(', ')}</td>
                  <td>{u.status || 'active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ORDERS */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Orders</h2>
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-2 font-mono">{o._id}</td>
                  <td>{o.userId?.email}</td>
                  <td>LKR {o.totalAmount}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
