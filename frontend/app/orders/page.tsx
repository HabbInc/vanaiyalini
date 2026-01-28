'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/orders')
      .then(setOrders)
      .catch((e) => {
        setErr(e.message);
        router.push('/login');
      });
  }, [router]);

  if (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {err}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-gray-600 mt-1">Your checkout history.</p>
        </div>
        <a href="/products" className="text-sm hover:underline">
          ← Back to products
        </a>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-gray-600">
          No orders yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-gray-600">Order ID</div>
                  <div className="font-mono text-sm">{o._id}</div>
                </div>

                <div className="flex gap-3 items-center">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {o.status}
                  </span>
                  <div className="text-lg font-bold">LKR {o.totalAmount}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                Items: <span className="font-medium text-gray-900">{o.items?.length ?? 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
