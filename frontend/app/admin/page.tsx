'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function AdminPage() {
  const router = useRouter();

  // ✅ ALL HOOKS AT TOP
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [u, o, s, a] = await Promise.all([
          apiFetch('/admin/users'),
          apiFetch('/admin/orders'),
          apiFetch('/admin/summary'),
          apiFetch('/admin/analytics/sales'),
        ]);

        setUsers(u);
        setOrders(o);
        setSummary(s);
        setAnalytics(a);
      } catch (e: any) {
        setErr(e.message);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* ERROR */}
      {err && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}

      {/* LOADING */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* CONTENT */}
      {!loading && !err && (
        <>
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
                <div className="text-2xl font-bold">
                  LKR {summary.totalRevenue}
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Sales Analytics</h2>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-xl p-4">
                <h3 className="font-medium mb-2">Orders per Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <h3 className="font-medium mb-2">Revenue per Day (LKR)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#16a34a"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* USERS */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Users</h2>

            <div className="overflow-x-auto border rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Roles</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.roles?.join(', ')}</td>
                      <td className="p-2">{u.status || 'active'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
