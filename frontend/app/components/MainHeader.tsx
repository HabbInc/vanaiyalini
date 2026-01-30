'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStoredUser, isLoggedIn } from '../lib/auth';

export default function MainHeader() {
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const l = isLoggedIn();
    setLogged(l);

    const u = getStoredUser();
    setIsSeller(!!u?.roles?.includes('seller'));
  }, []);

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setLogged(false);
    router.push('/login');
  }

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/products" className="font-bold text-xl">
          MiniEcom
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/products" className="hover:underline">Products</Link>

          {logged ? (
            <>
              <Link href="/cart" className="hover:underline">Cart</Link>
              <Link href="/orders" className="hover:underline">Orders</Link>
              <Link href="/profile" className="hover:underline">Profile</Link>

              {isSeller && (
                <Link href="/seller/products" className="hover:underline">
                  Seller
                </Link>
              )}

              <button
                onClick={logout}
                className="rounded border px-3 py-1 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
