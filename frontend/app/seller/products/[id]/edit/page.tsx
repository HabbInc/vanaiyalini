'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../../lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function EditSellerProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    setErr(null);
    setMsg(null);
    setLoading(true);

    apiFetch(`/products/${id}`) // public endpoint, okay
      .then((p) => {
        setTitle(p.title ?? '');
        setDescription(p.description ?? '');
        setPrice(Number(p.price ?? 0));
        setStock(Number(p.stock ?? 0));
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);
    try {
      await apiFetch(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title, description, price, stock }),
      });
      setMsg('Updated ✅');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    const ok = confirm('Delete this product?');
    if (!ok) return;

    setErr(null);
    setMsg(null);
    setDeleting(true);
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      router.push('/seller/products');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update your product details.</p>
        </div>
        <button
          onClick={() => router.push('/seller/products')}
          className="text-sm hover:underline"
        >
          ← Back
        </button>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {msg}
        </div>
      )}

      <form onSubmit={save} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="mt-1 w-full rounded-lg border p-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border p-2"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border p-2"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            disabled={saving}
            className="rounded-lg bg-black text-white px-4 py-2 font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
