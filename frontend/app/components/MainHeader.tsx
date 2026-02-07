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
    <header className="w-full bg-white/60 backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">
            MiniEcom<span className="text-red-500">.</span>
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link className="hover:opacity-70" href="/">Home</Link>
          <Link className="hover:opacity-70" href="/products">Products</Link>
          <Link className="hover:opacity-70" href="/about">About</Link>

          {logged && (
            <>
              {isSeller && (
                <Link className="hover:opacity-70" href="/seller/products">
                  Seller
                </Link>
              )}
              <Link className="hover:opacity-70" href="/orders">Orders</Link>
              <Link className="hover:opacity-70" href="/cart">Cart</Link>
              <Link className="hover:opacity-70" href="/profile">Profile</Link>
            </>
          )}
        </nav>

        {/* RIGHT ICONS + AUTH */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-black/5" aria-label="Search">
            <IconSearch />
          </button>

          <Link href="/wishlist">
            <button className="p-2 rounded-full hover:bg-black/5 " aria-label="Favorites">
              <IconHeart />
            </button>
          </Link>

          {logged ? (
            <button
              onClick={logout}
              className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
            >
              Logout
            </button>
          ) : (
            <>
              <Link className="text-sm hover:opacity-70" href="/login">Login</Link>
              <Link className="text-sm hover:opacity-70" href="/register">Register</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

/* ---------------- ICONS ---------------- */

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-4.6-9.4-8.4C.8 9.6 2.4 6.5 5.6 5.6c1.9-.6 4 .1 5.4 1.6
           1.4-1.5 3.5-2.2 5.4-1.6 3.2.9 4.8 4 3 7
           -2.4 3.8-9.4 8.4-9.4 8.4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 8h12l-1 13H7L6 8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 8a3 3 0 016 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
