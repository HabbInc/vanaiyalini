'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/products')
      .then(setProducts)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-600 mt-1">Browse available items and add them to your cart.</p>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/products/${p._id}`}
            className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {p.imageUrl ? (
                  <img
                    src={`http://localhost:3001${p.imageUrl}`}
                    alt={p.title}
                    className="w-full h-36 object-cover rounded-lg mb-3 border"
                  />
                ) : (
                <div className="w-full h-36 rounded-lg mb-3 bg-gray-100 border flex items-center justify-center text-gray-500 text-sm">
                    No image
                </div>
                )}
                <h2 className="text-lg font-semibold group-hover:underline">
                  {p.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {p.description || 'No description'}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Stock: {p.stock ?? 0}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xl font-bold">LKR {p.price}</div>
              <div className="text-sm text-gray-500">View →</div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && !error && (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          No products found.
        </div>
      )}
    </div>
  );
}
