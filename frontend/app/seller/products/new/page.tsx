'use client';

import { useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({ title, description, price, stock }),
      });
      router.push('/seller/products');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add New Product</h1>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />

        <button
          disabled={loading}
          className="rounded-lg bg-black text-white px-4 py-2"
        >
          {loading ? 'Saving...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
