'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../../../lib/api';
import { useParams, useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

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

  // main image (optional)
  const [imageUrl, setImageUrl] = useState('');

  // ✅ multiple images from backend
  const [images, setImages] = useState<string[]>([]);

  // ✅ selected upload files
  const [files, setFiles] = useState<File[]>([]);

  const previews = useMemo(() => {
    return files.map((f) => URL.createObjectURL(f));
  }, [files]);

  async function load() {
    setLoading(true);
    try {
      const p = await apiFetch(`/products/${id}`);
      setTitle(p.title);
      setDescription(p.description || '');
      setPrice(p.price);
      setStock(p.stock);
      setImageUrl(p.imageUrl || '');
      setImages(Array.isArray(p.images) ? p.images : []);
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
      setMsg('Product updated ✅');
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  // ✅ upload multiple images
  async function uploadImages() {
    if (!files.length) return;
    setUploading(true);
    setErr(null);
    setMsg(null);

    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f)); // ✅ must match FilesInterceptor('files')

      await apiFetch(`/products/${id}/images`, {
        method: 'POST',
        body: fd,
      });

      setFiles([]);
      setMsg('Images uploaded ✅');
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
          <p className="text-gray-600">Admin can edit any product</p>
        </div>

        <button onClick={() => router.push('/admin/products')} className="text-sm underline">
          Back
        </button>
      </header>

      {err && <div className="bg-red-50 border border-red-200 p-4 text-red-700 rounded">{err}</div>}
      {msg && <div className="bg-green-50 border border-green-200 p-4 text-green-700 rounded">{msg}</div>}

      <div className="bg-white border rounded-xl p-6 space-y-6">
        {/* ✅ IMAGES PREVIEW (existing + selected) */}
        <section className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {/* existing images */}
            {images?.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img + i}
                src={img.startsWith('http') ? img : `${API_BASE}${img}`}
                className="h-28 w-full object-cover rounded border"
                alt=""
              />
            ))}

            {/* fallback to main imageUrl */}
            {!images?.length && imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${API_BASE}${imageUrl}`}
                className="h-28 w-full object-cover rounded border"
                alt=""
              />
            )}

            {/* selected previews */}
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src + i}
                src={src}
                className="h-28 w-full object-cover rounded border ring-2 ring-black/20"
                alt=""
              />
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />

          <button
            type="button"
            onClick={uploadImages}
            disabled={!files.length || uploading}
            className="border px-4 py-2 rounded"
          >
            {uploading ? 'Uploading...' : `Upload ${files.length || ''} Image(s)`}
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

          <button disabled={saving} className="bg-black text-white px-4 py-2 rounded">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
