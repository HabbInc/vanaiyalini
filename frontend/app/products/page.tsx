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

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="grid gap-4">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/products/${p._id}`}
            className="border p-4 hover:bg-gray-50"
          >
            <div className="font-semibold">{p.title}</div>
            <div className="text-gray-600">LKR {p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

