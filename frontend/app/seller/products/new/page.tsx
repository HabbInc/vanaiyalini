'use client';

import { useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();

  // form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  // image upload
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // ui state
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  function onPickFile(f: File | null) {
    setFile(f);
    if (!f) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!title.trim()) return setErr('Title is required');
    if (price <= 0) return setErr('Price must be greater than 0');
    if (stock < 0) return setErr('Stock cannot be negative');

    setCreating(true);

    try {
      // 1) Create product (must return created product with _id)
      const created = await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({ title, description, price, stock }),
      });

      const productId = created?._id;
      if (!productId) {
        // If backend doesn’t return _id, we cannot auto upload. Still ok.
        setMsg('Product created ✅ (No id returned, upload image using Edit page)');
        router.push('/seller/products');
        return;
      }

      // 2) Upload image (optional)
      if (file) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);

        await apiFetch(`/products/${productId}/image`, {
          method: 'POST',
          body: fd,
        });

        setUploading(false);
      }

      setMsg('Product created ✅');
      router.push('/seller/products');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setCreating(false);
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-gray-600 mt-1">Create a product and optionally upload an image.</p>
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

      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        {/* IMAGE */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Product Image (optional)</h2>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-72 object-cover rounded-xl border"
            />
          ) : (
            <div className="w-full h-48 rounded-xl border bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
              No image selected
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />

          <p className="text-xs text-gray-500">
            Tip: image will upload after product is created.
          </p>
        </div>

        <hr />

        {/* DETAILS */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input
              className="mt-1 w-full rounded-lg border p-2"
              placeholder="e.g., iPhone 15"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border p-2"
              rows={4}
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Price (LKR) *</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border p-2"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Stock *</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border p-2"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            disabled={creating || uploading}
            className="rounded-lg bg-black text-white px-4 py-2 font-medium disabled:opacity-50"
          >
            {creating ? 'Creating...' : uploading ? 'Uploading image...' : 'Create Product'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTitle('');
              setDescription('');
              setPrice(0);
              setStock(0);
              onPickFile(null);
              setErr(null);
              setMsg(null);
            }}
            className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
