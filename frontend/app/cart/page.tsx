'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function loadCart() {
    try {
      const c = await apiFetch('/cart');
      setCart(c);
    } catch (e: any) {
      setErr(e.message);
      router.push('/login');
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQty(productId: string, qty: number) {
    await apiFetch(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ qty }),
    });
    await loadCart();
  }

  async function removeItem(productId: string) {
    await apiFetch(`/cart/items/${productId}`, { method: 'DELETE' });
    await loadCart();
  }

  async function checkout() {
    await apiFetch('/orders', { method: 'POST' });
    router.push('/orders');
  }

  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!cart) return <div className="p-6">Loading...</div>;

  const items = cart.items ?? [];

  const total = items.reduce((sum: number, it: any) => {
    const p = it.productId; // populated product object
    const price = p?.price ?? 0;
    return sum + price * it.qty;
  }, 0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {items.length === 0 && <p>Your cart is empty.</p>}

      <div className="space-y-3">
        {items.map((it: any) => {
          const p = it.productId;
          const productId = p?._id ?? it.productId;
          return (
            <div key={productId} className="border p-4">
              <div className="font-semibold">{p?.title ?? 'Product'}</div>
              <div className="text-sm text-gray-600">LKR {p?.price ?? 0}</div>

              <div className="flex gap-2 items-center mt-2">
                <input
                  type="number"
                  min={1}
                  className="border p-2 w-24"
                  value={it.qty}
                  onChange={(e) => updateQty(productId, Number(e.target.value))}
                />
                <button className="underline" onClick={() => removeItem(productId)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="font-semibold">Total: LKR {total}</div>
          <button onClick={checkout} className="bg-black text-white px-4 py-2">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
