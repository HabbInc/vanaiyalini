'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/admin/orders')
      .then(setOrders)
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">All Orders</h1>
      {err && <div className="text-red-600">{err}</div>}

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-2 font-mono">{o._id}</td>
                <td>{o.userId?.email}</td>
                <td>LKR {o.totalAmount}</td>
                <td>{o.status}</td>
                <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
