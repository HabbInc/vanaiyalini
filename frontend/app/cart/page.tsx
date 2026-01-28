'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  async function loadCart() {
    try {
      const c = await apiFetch('/cart');
      setCart(c);
    } catch (e: any) {
      setErr(e.message);
      router.push('/login');
    }
  }

  useEffect(() => { loadCart(); }, []);

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
    setLoadingCheckout(true);
    try {
      await apiFetch('/orders', { method: 'POST' });
      router.push('/orders');
    } finally {
      setLoadingCheckout(false);
    }
  }

  if (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {err}
      </div>
    );
  }

  if (!cart) return <div className="text-gray-600">Loading...</div>;

  const items = cart.items ?? [];
  const total = items.reduce((sum: number, it: any) => {
    const p = it.productId;
    const price = p?.price ?? 0;
    return sum + price * it.qty;
  }, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cart</h1>
          <p className="text-gray-600 mt-1">Update quantities and checkout when ready.</p>
        </div>
        <a href="/products" className="text-sm hover:underline">
          ← Continue shopping
        </a>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-gray-600">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((it: any) => {
              const p = it.productId;
              const productId = p?._id ?? it.productId;
              return (
                <div key={productId} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold">{p?.title ?? 'Product'}</div>
                      <div className="text-sm text-gray-600">LKR {p?.price ?? 0}</div>
                    </div>
                    <button
                      onClick={() => removeItem(productId)}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-sm text-gray-700">Qty</span>
                    <input
                      type="number"
                      min={1}
                      className="w-24 rounded-lg border p-2"
                      value={it.qty}
                      onChange={(e) => updateQty(productId, Number(e.target.value))}
                    />
                    <div className="ml-auto text-sm text-gray-600">
                      Line total: <span className="font-semibold">LKR {(p?.price ?? 0) * it.qty}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Items</span>
              <span className="font-medium">{items.length}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-bold">LKR {total}</span>
            </div>

            <button
              onClick={checkout}
              disabled={loadingCheckout}
              className="mt-4 w-full rounded-lg bg-black py-2 text-white font-medium disabled:opacity-50"
            >
              {loadingCheckout ? 'Processing...' : 'Checkout'}
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Checkout creates a pending order and clears your cart.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
