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
                      <option value="delivered">delivered</option>
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
