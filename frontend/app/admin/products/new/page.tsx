'use client';

import { useMemo, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function AdminAddProductPage() {
  const router = useRouter();

  // Product fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  // Image
  const [file, setFile] = useState<File | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Preview selected image
  const previewUrl = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!title.trim()) {
      setErr('Title is required');
      return;
    }

    if (price <= 0) {
      setErr('Price must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create product
      const product = await apiFetch('/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          price,
          stock,
        }),
      });

      // 2️⃣ Upload image (optional)
      if (file) {
        const fd = new FormData();
        fd.append('file', file);

        await apiFetch(`/products/${product._id}/image`, {
          method: 'POST',
          body: fd,
        });
      }

      router.push('/admin/products');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Add New Product
        </h1>
        <p className="text-gray-600 mt-1">
          Create a product as an admin. You can edit or remove it anytime.
        </p>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={submit}
        className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        {/* IMAGE */}
        <section className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Product Image
          </label>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-xl border"
            />
          ) : (
            <div className="w-full h-48 rounded-xl border bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
              No image selected
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />

          <p className="text-xs text-gray-500">
            Optional. JPG/PNG recommended. Max size 3MB.
          </p>
        </section>

        <hr />

        {/* TITLE */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Product Title *
          </label>
          <input
            className="mt-1 w-full rounded-lg border p-2"
            placeholder="e.g. Wireless Headphones"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="mt-1 w-full rounded-lg border p-2"
            rows={4}
            placeholder="Product details, features, usage..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* PRICE + STOCK */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Price (LKR) *
            </label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border p-2"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Stock Quantity *
            </label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border p-2"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            disabled={loading}
            className="rounded-lg bg-black text-white px-4 py-2 font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
