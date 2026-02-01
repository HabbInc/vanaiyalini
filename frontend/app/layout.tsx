'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import HeaderSwitcher from './components/HeaderSwitcher';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages that should NOT have the main header
  const hideHeaderRoutes = ['/about'];

  const hideHeader = hideHeaderRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        {!hideHeader && <HeaderSwitcher />}

        <main className={hideHeader ? '' : 'max-w-7xl mx-auto px-4 py-6'}>
          {children}
        </main>
      </body>
    </html>
  );
}
