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
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="border p-4">
            <div className="font-semibold">Order ID: {o._id}</div>
            <div>Status: {o.status}</div>
            <div>Total: LKR {o.totalAmount}</div>
            <div className="text-sm text-gray-600">
              Items: {o.items?.length ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
