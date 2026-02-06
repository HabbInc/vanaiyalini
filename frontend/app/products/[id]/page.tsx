"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useParams, useRouter } from "next/navigation";

type Product = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;

  // Optional: if you have these later from backend
  images?: string[];
  sizes?: string[];
  colors?: string[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // UI selections (frontend only)
  const [activeImage, setActiveImage] = useState<string>("");
  const [size, setSize] = useState<string>("M");
  const [color, setColor] = useState<string>("Default");

  useEffect(() => {
    apiFetch(`/products/${id}`)
      .then((p: Product) => {
        setProduct(p);

        // Build image list:
        const images = (p.images && p.images.length ? p.images : []) as string[];

        // If backend only has imageUrl, add it as the main image:
        const main = p.imageUrl ? `${API_BASE}${p.imageUrl}` : "";
        const list = images.length ? images : main ? [main] : [];

        setActiveImage(list[0] ?? "");
        setColor((p.colors?.[0] ?? "Default") as string);
        setSize((p.sizes?.[2] ?? p.sizes?.[0] ?? "M") as string);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const outOfStock = (product?.stock ?? 0) <= 0;

  const images = useMemo(() => {
    if (!product) return [];
    const list: string[] = [];

    if (product.images?.length) {
      // If product.images are stored as relative paths, convert here if needed.
      // If they are full URLs already, keep them as-is.
      // For safety, treat relative as API_BASE + path.
      for (const img of product.images) {
        if (!img) continue;
        list.push(img.startsWith("http") ? img : `${API_BASE}${img}`);
      }
    }

    if (product.imageUrl) {
      const main = `${API_BASE}${product.imageUrl}`;
      if (!list.includes(main)) list.unshift(main);
    }

    return list;
  }, [product]);

  async function addToCart() {
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId: id, qty }),
      });
      setMessage("Added to cart ✅");
    } catch (e: any) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-zinc-600">
        Loading...
      </div>
    );
  }

  const sizes = product.sizes?.length ? product.sizes : ["XS", "S", "M", "L"];
  const colors = product.colors?.length ? product.colors : ["Default", "Black"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/products")}
          className="text-sm text-zinc-600 hover:underline"
        >
          ← Back to products
        </button>

        <button
          onClick={() => router.push("/cart")}
          className="text-sm text-zinc-900 hover:underline"
        >
          Go to cart →
        </button>
      </div>

      {/* Layout like the screenshot */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-[80px_1fr_360px]">
        {/* Thumbnails */}
        <div className="order-2 flex gap-3 md:order-1 md:flex-col">
          {images.length ? (
            images.map((img) => (
              <button
                key={img}
                onClick={() => setActiveImage(img)}
                className={`h-16 w-16 overflow-hidden border transition
                ${
                  activeImage === img
                    ? "border-zinc-900"
                    : "border-zinc-200 hover:border-zinc-400"
                }`}
                aria-label="Select image"
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))
          ) : (
            <div className="h-16 w-16 rounded-md border border-zinc-200 bg-zinc-100" />
          )}
        </div>

        {/* Main Image */}
        <div className="order-1 md:order-2">
          <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-100">
            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeImage}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-zinc-500">
                No image
              </div>
            )}
          </div>

          {/* Dots */}
          {images.length > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              {images.slice(0, 5).map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={`h-2 w-2 rounded-full transition
                  ${
                    activeImage === img
                      ? "bg-zinc-900"
                      : "bg-zinc-300 hover:bg-zinc-400"
                  }`}
                  aria-label="Select image dot"
                  type="button"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Details */}
        <aside className="order-3">
          <div className="sticky top-24">
            <h1 className="text-lg font-medium">{product.title}</h1>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm text-zinc-600">LKR {product.price}</div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                Stock: {product.stock ?? 0}
              </span>
            </div>

            <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
              {product.description || "No description"}
            </p>

            <div className="mt-6 space-y-6 text-sm">
              {/* Size */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-700">Size</div>
                  <button
                    className="text-zinc-500 underline underline-offset-4 hover:text-zinc-800"
                    type="button"
                  >
                    Size guide
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`rounded-full border px-3 py-1 transition
                        ${
                          size === s
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      type="button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <div className="text-zinc-700">Color: {color}</div>
                <div className="mt-3 flex items-center gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-9 w-9 rounded-full border transition
                        ${
                          color === c
                            ? "border-zinc-900"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      aria-label={`Select color ${c}`}
                      title={c}
                      type="button"
                    >
                      <span className="sr-only">{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + Add */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center overflow-hidden rounded-md border border-zinc-200">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                    aria-label="Decrease quantity"
                    disabled={outOfStock}
                    type="button"
                  >
                    –
                  </button>
                  <div className="w-10 text-center">{qty}</div>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                    aria-label="Increase quantity"
                    disabled={outOfStock}
                    type="button"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  disabled={outOfStock || loading}
                  className="flex-1 rounded-md bg-zinc-900 px-4 py-3 text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {outOfStock
                    ? "Out of stock"
                    : loading
                    ? "Adding..."
                    : "Add to bag"}
                </button>

                <button
                  className="grid h-11 w-11 place-items-center rounded-md border border-zinc-200 hover:bg-zinc-50"
                  aria-label="Wishlist"
                  title="Wishlist"
                  type="button"
                >
                  ♡
                </button>
              </div>

              {/* Success message */}
              {message && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 text-sm">
                  {message}
                </div>
              )}

              {/* Accordions */}
              <div className="border-t border-zinc-200 pt-4">
                <Accordion
                  items={[
                    { title: "Description", content: product.description || "—" },
                    {
                      title: "Composition",
                      content: "Add composition details here (frontend now).",
                    },
                    {
                      title: "Model parameters",
                      content: "Add model details here (frontend now).",
                    },
                    {
                      title: "Product care",
                      content: "Add care instructions here (frontend now).",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* You may also like (simple placeholder) */}
      <section className="mt-16">
        <h2 className="text-center font-serif text-2xl">You may also like</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100" />
              <div className="mt-3 text-sm">
                <div className="text-zinc-800">Recommended item</div>
                <div className="text-zinc-600">LKR —</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- Small Accordion component (same file) ---------- */
function Accordion({
  items,
}: {
  items: { title: string; content: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-zinc-200">
      {items.map((it, idx) => {
        const open = openIndex === idx;
        return (
          <div key={it.title}>
            <button
              className="flex w-full items-center justify-between py-3 text-left text-sm"
              onClick={() => setOpenIndex(open ? null : idx)}
              type="button"
            >
              <span className="text-zinc-800">{it.title}</span>
              <span className="text-zinc-500">{open ? "–" : "+"}</span>
            </button>

            <div
              className={`grid transition-all duration-200 ease-out ${
                open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden text-sm text-zinc-600">
                {it.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
