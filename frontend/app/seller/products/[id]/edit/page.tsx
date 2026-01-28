'use client';

import { useEffect, useMemo, useState } from 'react';
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

  // image
  const [imageUrl, setImageUrl] = useState<string>(''); // from DB (/uploads/...)
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

  async function loadProduct() {
    setErr(null);
    setMsg(null);
    setLoading(true);

    try {
      const p = await apiFetch(`/products/${id}`); // public read ok
      setTitle(p.title ?? '');
      setDescription(p.description ?? '');
      setPrice(Number(p.price ?? 0));
      setStock(Number(p.stock ?? 0));
      setImageUrl(p.imageUrl ?? '');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setMsg('Product details updated ✅');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage() {
    if (!file) return;

    setErr(null);
    setMsg(null);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);

      await apiFetch(`/products/${id}/image`, {
        method: 'POST',
        body: fd,
      });

      setMsg('Image uploaded ✅');
      setFile(null);
      await loadProduct(); // refresh DB imageUrl
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading(false);
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
          <p className="text-gray-600 mt-1">
            Update product details and upload/change image anytime.
          </p>
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

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        {/* IMAGE SECTION */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Product Image</h2>

          {/* Show selected preview first, otherwise show saved image, otherwise placeholder */}
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected preview"
              className="w-full max-h-72 object-cover rounded-xl border"
            />
          ) : imageUrl ? (
            <img
              src={`http://localhost:3001${imageUrl}`}
              alt="Product"
              className="w-full max-h-72 object-cover rounded-xl border"
            />
          ) : (
            <div className="w-full h-52 rounded-xl border bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
              No image uploaded
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />

            <button
              type="button"
              onClick={uploadImage}
              disabled={!file || uploading}
              className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-sm hover:underline text-gray-600"
              >
                Clear selected
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            You can upload an image anytime (even if product initially had no image).
          </p>
        </section>

        <hr />

        {/* DETAILS FORM */}
        <form onSubmit={save} className="space-y-4">
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
    </div>
  );
}
