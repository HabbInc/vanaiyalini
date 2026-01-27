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

  useEffect(() => {
    apiFetch(`/products/${id}`)
      .then(setProduct)
      .catch((e) => setError(e.message));
  }, [id]);

  async function addToCart() {
    try {
      await apiFetch('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId: id, qty }),
      });
      setMessage('Added to cart ✅');
    } catch (e: any) {
      router.push('/login');
    }
  }

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      <p className="font-semibold">LKR {product.price}</p>

      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border p-2 w-24"
        />
        <button
          onClick={addToCart}
          className="bg-black text-white px-4 py-2"
        >
          Add to cart
        </button>
      </div>

      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}
