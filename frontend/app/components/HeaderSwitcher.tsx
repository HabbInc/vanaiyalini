'use client';

import { useEffect, useState } from 'react';
import AdminHeader from './AdminHeader';
import MainHeader from './MainHeader';
import { isAdminUser, isLoggedIn } from '../lib/auth';

export default function HeaderSwitcher() {
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(isLoggedIn());
    setAdmin(isAdminUser());
    setReady(true);
  }, []);

  // Avoid hydration mismatch
  if (!ready) return null;

  // If logged in as admin -> admin header
  if (logged && admin) return <AdminHeader />;

  // otherwise normal header
  return <MainHeader />;
}
