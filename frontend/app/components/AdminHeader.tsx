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
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="font-bold text-xl">
          MiniEcom Admin
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/admin" className="hover:underline">Dashboard</Link>
          <Link href="/admin/users" className="hover:underline">Users</Link>
          <Link href="/admin/products" className="hover:underline">Products</Link>
          <Link href="/admin/orders" className="hover:underline">Orders</Link>
          <Link href="/admin/payments" className="hover:underline">Payments</Link>
          <Link href="/admin/profile" className="hover:underline">Profile</Link>

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
