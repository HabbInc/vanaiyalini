'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../../../lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

  async function load() {
    setLoading(true);
    try {
      const p = await apiFetch(`/products/${id}`);
      setTitle(p.title);
      setDescription(p.description || '');
      setPrice(p.price);
      setStock(p.stock);
      setImageUrl(p.imageUrl || '');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setMsg(null);

    try {
      await apiFetch(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title, description, price, stock }),
      });
      setMsg('Product updated');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage() {
    if (!file) return;
    setUploading(true);
    setErr(null);

    try {
      const fd = new FormData();
      fd.append('file', file);

      await apiFetch(`/products/${id}/image`, {
        method: 'POST',
        body: fd,
      });

      setFile(null);
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Edit Product (Admin)</h1>
          <p className="text-gray-600">
            Admin can edit any product
          </p>
        </div>

        <button
          onClick={() => router.push('/admin/products')}
          className="text-sm underline"
        >
          Back
        </button>
      </header>

      {err && (
        <div className="bg-red-50 border border-red-200 p-4 text-red-700 rounded">
          {err}
        </div>
      )}
      {msg && (
        <div className="bg-green-50 border border-green-200 p-4 text-green-700 rounded">
          {msg}
        </div>
      )}

      <div className="bg-white border rounded-xl p-6 space-y-6">
        {/* IMAGE */}
        <section className="space-y-3">
          {previewUrl ? (
            <img src={previewUrl} className="rounded border max-h-64 w-full object-cover" />
          ) : imageUrl ? (
            <img
              src={`http://localhost:3001${imageUrl}`}
              className="rounded border max-h-64 w-full object-cover"
            />
          ) : (
            <div className="h-48 border rounded flex items-center justify-center text-gray-500">
              No image
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <button
            type="button"
            onClick={uploadImage}
            disabled={!file || uploading}
            className="border px-4 py-2 rounded"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </section>

        <hr />

        {/* FORM */}
        <form onSubmit={save} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              className="border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <input
              type="number"
              className="border p-2 rounded"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>

          <button
            disabled={saving}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
