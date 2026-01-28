'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/products/mine')
      .then(setProducts)
      .catch((e) => {
        setErr(e.message);
        router.push('/profile');
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-gray-600 mt-1">
            Products you created as a seller
          </p>
        </div>

        <a
          href="/seller/products/new"
          className="rounded-lg bg-black text-white px-4 py-2"
        >
          + Add Product
        </a>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-gray-600">
          You haven’t added any products yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {p.description || 'No description'}
              </p>

              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold">LKR {p.price}</span>
                <span className="text-xs rounded-full bg-gray-100 px-3 py-1">
                  Stock: {p.stock}
                </span>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  className="text-sm underline"
                  onClick={() =>
                    router.push(`/seller/products/${p._id}/edit`)
                  }
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
