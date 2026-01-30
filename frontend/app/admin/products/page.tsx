'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const data = await apiFetch('/admin/products');
      setProducts(data);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      await apiFetch(`/admin/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Manage Products</h1>
      {err && <div className="text-red-600">{err}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="rounded-xl border bg-white p-5 shadow-sm">
            {p.imageUrl ? (
              <img
                src={`http://localhost:3001${p.imageUrl}`}
                alt={p.title}
                className="w-full h-40 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-full h-40 rounded-lg border bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
                No image
              </div>
            )}

            <h2 className="mt-3 font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-2">
              {p.description || 'No description'}
            </p>

            <div className="mt-2 font-bold">LKR {p.price}</div>

            <button
              onClick={() => deleteProduct(p._id)}
              className="mt-3 text-red-600 underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
