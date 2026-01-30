'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  }

  return (
    <header className="w-full bg-white/60 backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/admin" className="font-bold text-xl">
          <span className="text-lg font-semibold tracking-tight">
            MiniEcom<span className="text-red-500">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/admin" className="hover:underline hover:opacity-70">Dashboard</Link>
          <Link href="/admin/users" className="hover:underline hover:opacity-70">Users</Link>
          <Link href="/admin/products" className="hover:underline hover:opacity-70">Products</Link>
          <Link href="/admin/orders" className="hover:underline hover:opacity-70">Orders</Link>
          <Link href="/admin/payments" className="hover:underline hover:opacity-70">Payments</Link>
          <Link href="/admin/profile" className="hover:underline hover:opacity-70">Profile</Link>
          <button
            onClick={logout}
            className="rounded border px-3 py-1 hover:bg-gray-50"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
