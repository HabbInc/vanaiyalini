'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch(`/products/${id}`)
      .then(setProduct)
      .catch((e) => setError(e.message));
  }, [id]);

  async function addToCart() {
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      await apiFetch('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId: id, qty }),
      });
      setMessage('Added to cart ✅');
    } catch (e: any) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!product) return <div className="text-gray-600">Loading...</div>;

  const outOfStock = (product.stock ?? 0) <= 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/products')}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to products
        </button>
        <a href="/cart" className="text-sm hover:underline">
          Go to cart →
        </a>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            {product.imageUrl && (
            <img
                src={`http://localhost:3001${product.imageUrl}`}
                alt={product.title}
                className="w-full max-h-80 object-cover rounded-xl border"
            />
            )}
            <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
            <p className="text-gray-600">
              {product.description || 'No description'}
            </p>
            <div className="flex gap-2 items-center">
              <span className="text-2xl font-bold">LKR {product.price}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                Stock: {product.stock ?? 0}
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4 w-full sm:w-80 space-y-3">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border p-2"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              disabled={outOfStock}
            />

            <button
              onClick={addToCart}
              disabled={outOfStock || loading}
              className="w-full rounded-lg bg-black text-white py-2 font-medium disabled:opacity-50"
            >
              {outOfStock ? 'Out of stock' : loading ? 'Adding...' : 'Add to cart'}
            </button>

            {message && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 text-sm">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
